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
    const response = await axios.head(`${url}`, {
      timeout: 5000,
      maxRedirects: 3,
    });
    return { statuscode: response.status, latency: Date.now() - start };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 405) {
        const fallbackStart = Date.now();
        const response = await axios.get(url, {
          timeout: 5000,
          responseType: "stream",
        });
        response.data.destroy();

        return {
          statuscode: response.status,
          latency: Date.now() - fallbackStart,
        };
      }
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

  console.log(
    "downmonitorid ",
    downMonitorsId,
    "time is",
    new Date().toISOString(),
  );

  try {
    await prisma.$transaction(
      async (tx) => {
        //store all logs in bulk
        await tx.pingLog.createMany({
          data: pingResults.map((obj) => ({
            monitorId: obj.monitorId,
            statusCode: obj.statusCode,
            latency: obj.latency,
          })),
        });

        if (upMonitorsId.length > 0) {
          //updating monitor statusChangedAt field for new UP monitor
          await tx.monitor.updateMany({
            where: { id: { in: upMonitorsId }, status: "DOWN" },
            data: {
              statusChangedAt: new Date(),
            },
          });

          // update monitor which are UP monitor
          await tx.monitor.updateMany({
            where: {
              id: { in: upMonitorsId },
            },
            data: {
              lastChecked: new Date(),
              consecutiveFailure: 0,
              processed: false,
              status: "UP",
            },
          });

          //updating incident status for new UP monitor
          await tx.incident.updateMany({
            where: {
              monitorId: { in: upMonitorsId },
              OR: [
                { currentStatus: "ACKNOWLEDGED" },
                { currentStatus: "PROCESSED" },
                { currentStatus: "OPEN" },
              ],
            },
            data: {
              currentStatus: "RESOLVED",
              resolvedAt: new Date(),
              alertCount: 0,
            },
          });
        }

        if (downMonitorsId.length > 0) {
          // update statusChangedAt field for new DOWN monitor
          await tx.monitor.updateMany({
            where: { id: { in: downMonitorsId }, status: "UP" },
            data: {
              statusChangedAt: new Date(),
            },
          });
          // update monitor which are DOWN monitor
          await tx.monitor.updateMany({
            where: { id: { in: downMonitorsId }, status: "DOWN" },
            data: {
              consecutiveFailure: { increment: 1 },
              lastChecked: new Date(),
              status: "DOWN",
            },
          });

          //find monitor which DOWN and consecutive failure
          const monitorToAlert = await tx.monitor.findMany({
            where: {
              id: { in: downMonitorsId },
              status: "DOWN",
              consecutiveFailure: { gte: 2 },
              processed: false,
            },
            select: {
              id: true,
            },
          });

          if (monitorToAlert.length > 0) {
            // create new incident
            await tx.incident.createMany({
              data: monitorToAlert.map((obj) => ({ monitorId: obj.id })),
            });

            // update monitor processed field
            await tx.monitor.updateMany({
              where: { id: { in: monitorToAlert.map((obj) => obj.id) } },
              data: {
                processed: true,
              },
            });
          }
        }
        return [];
      },
      { timeout: 10000 },
    );
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

async function reclaimStalePending(): Promise<PingResult[]> {
  //claim from pending list
  const result = await consumerClient.xautoclaim(
    "Orbit:monitors",
    "monitor-group-1",
    "worker-1",
    30_000,
    "0-0",
    "COUNT",
    "10",
  );

  const claimed = result[1] as [string, string[]][];

  //check status of pending monitors ticks
  if (!claimed || claimed.length === 0) return [];
  const pingResults: (PingResult | undefined)[] = await Promise.all(
    claimed.map(async ([id, fields]) => {
      const monitorData: Record<string, string> = {};
      for (let i = 0; i < fields.length; i += 2) {
        monitorData[fields[i]!] = fields[i + 1]!;
      }
      const url = monitorData.url;
      const monitorId = monitorData.id;
      if (url && monitorId) {
        const res = await checkStatus(url);

        return {
          redisId: id,
          monitorId,
          statusCode: res.statuscode,
          latency: res.latency,
        };
      }
    }),
  );
  return pingResults.filter((r) => r != undefined);
}

async function processJobs() {
  try {
    //retries
    const reclaimedResults = await reclaimStalePending();
    if (reclaimedResults.length > 0) {
      await storeResult(reclaimedResults);
      await Promise.all(
        reclaimedResults.map((obj) => {
          consumerClient.xack("Orbit:monitors", "monitor-group-1", obj.redisId);
        }),
      );
    }

    //Bulk reading from consumer group
    const data = await consumerClient.xreadgroup(
      "GROUP",
      "monitor-group-1",
      "worker-1",
      "COUNT",
      "5",
      "BLOCK",
      "10",
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
            const payload = {
              monitorId: monitorId,
              statusCode: res.statuscode,
              latency: res.latency,
              timestamp: new Date().toISOString(),
            };

            //publish for new updated status for sse
            await consumerClient.publish(
              "monitor-updates",
              JSON.stringify(payload),
            );
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
