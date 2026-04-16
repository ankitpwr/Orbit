import cron from "node-cron";
import { prisma } from "../lib/prisma.js";
import { producerClient } from "../lib/redis.js";
const BATCH_SIZE = 20;

interface MonitorData {
  id: string;
  url: string;
}

async function publish() {
  try {
    console.log("starting producer! ");
    let cursorId: string | undefined = undefined;
    while (true) {
      // cursor based pagination for batch import
      const monitors: MonitorData[] = await prisma.monitor.findMany({
        where: {
          status: {
            not: "PAUSED",
          },
          nextPing: { lte: new Date() },
        },
        ...(cursorId ? { cursor: { id: cursorId } } : {}),
        skip: cursorId ? 1 : 0,
        take: BATCH_SIZE,
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true, url: true },
      });

      if (monitors.length == 0) break; // No more rows available

      const pipeline = producerClient.pipeline(); // creating redis-pipeline
      monitors.forEach((obj) => {
        const entries = Object.entries(obj).flatMap(([k, v]) => [
          k,
          v == null ? "" : String(v),
        ]);
        pipeline.xadd("Orbit:monitors", "MAXLEN", "~", "1000", "*", ...entries);
      });
      await pipeline.exec(); //adding Bulk entries to redis-stream
      cursorId = monitors[monitors.length - 1]?.id; // updating cursor to last fetched monitor ID
    }
  } catch (error) {
    console.log(error);
  }
}

// Schedule task for fetching monitors from DB
const publishTask = cron.schedule(
  "*/2 * * * *",
  async () => {
    await publish();
  },
  {
    noOverlap: true,
  },
);
publishTask.start();

async function deleteOlderLogs() {
  const thirtyDayAgo = new Date();
  thirtyDayAgo.setDate(thirtyDayAgo.getDate() - 30);

  await prisma.pingLog.deleteMany({
    where: {
      timestamp: {
        lt: thirtyDayAgo,
      },
    },
  });
}

// Scheduling task to delete older records
const deleteTask = cron.schedule("0 0 * * *", async () => {
  await deleteOlderLogs();
});
deleteTask.start();
