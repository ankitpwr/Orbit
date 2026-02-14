import { Prisma } from "../generated/prisma/client.js";
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

async function checkStatus(url: string): Promise<Response> {
  const start = Date.now();
  try {
    console.log("url is ", url);
    const response = await axios.get(`${url}`, { timeout: 5000 });
    return { statuscode: response.status, latency: Date.now() - start };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("error code", error.code);
      return {
        statuscode: error.response?.status || 500,
        latency: Date.now() - start,
      };
    }
    return { statuscode: 500, latency: Date.now() - start };
  }
}

async function storeResult(pingResults: PingResult[]) {
  const upMonitorsId = pingResults
    .filter((obj) => obj.statusCode >= 200 && obj.statusCode < 300)
    .map((val) => val.monitorId);
  const downMonitorsId = pingResults
    .filter((obj) => obj.statusCode < 200 && obj.statusCode >= 300)
    .map((val) => val.monitorId);
  try {
    const res = await prisma.$transaction([
      prisma.pingLog.createMany({
        data: pingResults.map((obj) => ({
          monitorId: obj.monitorId,
          statusCode: obj.statusCode,
          latency: obj.latency,
        })),
      }),

      prisma.monitor.updateMany({
        where: {
          id: { in: upMonitorsId },
        },
        data: {
          status: "UP",
          lastChecked: new Date(),
        },
      }),

      prisma.monitor.updateMany({
        where: {
          id: { in: downMonitorsId },
        },
        data: {
          status: "DOWN",
          lastChecked: new Date(),
        },
      }),
    ]);
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
  console.log("job processing start");
  try {
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
    if (!data) return;

    //@ts-ignore
    for (const [stream, entries] of data) {
      let pingResults: PingResult[] = await Promise.all(
        entries.map(async ([id, fields]: [string, string[]]) => {
          const monitorData: Record<string, string> = {};
          for (let i = 0; i < fields.length; i += 2) {
            monitorData[fields[i]!] = fields[i + 1]!;
          }
          console.log("monitordata: ", monitorData);
          const url = monitorData.url;
          const monitorId = monitorData.id;
          if (url && monitorId) {
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
      pingResults = pingResults.filter((r) => r != undefined);
      await storeResult(pingResults);
      await Promise.all(
        pingResults.map(async (obj) => {
          consumerClient.xack("Orbit:monitors", "monitor-group-1", obj.redisId);
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
