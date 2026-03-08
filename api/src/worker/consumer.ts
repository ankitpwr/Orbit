import { gte } from "zod";
import { MonitorStatus, Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { consumerClient } from "../lib/redis.js";
import axios, { AxiosError } from "axios";

interface Response {
  statuscode: number;
  latency: number;
}
interface PingResult {
  monitorId: string;
  statusCode: number;
  latency: number;
  redisId: string;
}

interface DownMonitor {
  id: string;
  url: string;
  email: string;
}

async function emitNoticationEvent(downMonitors: DownMonitor[]) {
  const pipeline = consumerClient.pipeline();
  downMonitors.forEach((obj) => {
    const entries = Object.entries(obj).flatMap(([k, v]) => [
      k,
      v == null ? "" : String(v),
    ]);

    pipeline.xadd("Orbit:notification", "MAXLEN", "~", "1000", "*", ...entries);
  });
  await pipeline.exec();
}

async function checkStatus(url: string): Promise<Response> {
  const start = Date.now();
  try {
    const response = await axios.get(`${url}`, {
      timeout: 5000,
    });
    return { statuscode: response.status, latency: Date.now() - start };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        statuscode: error.response?.status || 500,
        latency: Date.now() - start,
      };
    }
    return { statuscode: 500, latency: Date.now() - start };
  }
}

async function storeResult(pingResults: PingResult[]) {
  //filter out the url with status up!
  const upMonitorsId = pingResults
    .filter((obj) => obj.statusCode >= 200 && obj.statusCode < 300)
    .map((val) => val.monitorId);

  //filter out the url with status down!
  const downMonitorsId = pingResults
    .filter((obj) => obj.statusCode < 200 || obj.statusCode >= 300)
    .map((val) => val.monitorId);

  console.log("downmonitorid ", downMonitorsId);

  try {
    const monitorsToAlert = await prisma.$transaction(
      async (tx) => {
        //store all logs in bulk
        await tx.pingLog.createMany({
          data: pingResults.map((obj) => ({
            monitorId: obj.monitorId,
            statusCode: obj.statusCode,
            latency: obj.latency,
          })),
        });

        return [];
      },
      { timeout: 10000 },
    );

    // console.log("monitor to alert ", monitorsToAlert);
    // // if (monitorsToAlert.length > 0) {
    // //   await emitNoticationEvent(monitorsToAlert);
    // // }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        console.log("Monitor does not exist");
      } else console.log("database error");
    }
    console.log("Uable to Store Ping Logs!");
    console.log(error);
  }
}

async function processJobs() {
  try {
    //Bulk reading from consumer group
    const data = await consumerClient.xreadgroup(
      "GROUP",
      "monitor-group-1",
      "worker-1",
      "COUNT",
      "2",
      "BLOCK",
      "10000",
      "STREAMS",
      "Orbit:monitors",
      ">",
    );
    if (!data) {
      return;
    }

    //@ts-ignore
    for (const [stream, entries] of data) {
      let pingResults: PingResult[] = await Promise.all(
        entries.map(async ([id, fields]: [string, string[]]) => {
          const monitorData: Record<string, string> = {};

          //get 1 monitor data at a time
          for (let i = 0; i < fields.length; i += 2) {
            monitorData[fields[i]!] = fields[i + 1]!;
          }
          const url = monitorData.url;
          const monitorId = monitorData.id;
          if (url && monitorId) {
            // check website status
            const res = await checkStatus(url);
            return {
              redisId: id,
              monitorId: monitorId,
              statusCode: res.statuscode,
              latency: res.latency,
            };
          }
        }),
      );

      // filter out undefined entries
      pingResults = pingResults.filter((r) => r != undefined);

      // store result to logs table
      await storeResult(pingResults);

      // acknowledge
      await Promise.all(
        pingResults.map(async (obj) => {
          await consumerClient.xack(
            "Orbit:monitors",
            "monitor-group-1",
            obj.redisId,
          );
        }),
      );
    }
  } catch (error) {
    console.log("error !", error);
  }
}

async function startConsumer() {
  while (true) {
    try {
      await processJobs();
    } catch (error) {
      console.log("error !", error);
    }
  }
}
startConsumer();
