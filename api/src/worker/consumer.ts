import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { consumerClient } from "../lib/redis.js";
import axios, { AxiosError } from "axios";

interface Response {
  statuscode: number;
  latency: number;
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

async function storeResult(
  monitorId: string,
  statusCode: number,
  latency: number,
) {
  const code = statusCode == 200 ? "UP" : "DOWN";
  try {
    const res = await prisma.$transaction([
      prisma.pingLog.create({
        data: {
          monitorId: monitorId,
          statusCode: statusCode,
          latency: latency,
        },
      }),

      prisma.monitor.update({
        where: { id: monitorId },
        data: {
          status: code,
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
      await Promise.all(
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
            await storeResult(monitorId, res.statuscode, res.latency);
            await consumerClient.xack("Orbit:monitors", "monitor-group-1", id);
          }
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
