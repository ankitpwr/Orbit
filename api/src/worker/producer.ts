import cron from "node-cron";
import { prisma } from "../lib/prisma.js";
import { producerClient } from "../lib/redis.js";
const BATCH_SIZE = 2;

interface MonitorData {
  id: string;
  url: string;
}

async function publish() {
  try {
    console.log("starting producer! ");
    let cursorId: string | undefined = undefined;
    while (true) {
      const monitors: MonitorData[] = await prisma.monitor.findMany({
        ...(cursorId ? { cursor: { id: cursorId } } : {}),
        skip: cursorId ? 1 : 0,
        take: BATCH_SIZE,
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true, url: true },
      });
      console.log("monitors are", monitors);

      if (monitors.length == 0) break;

      const pipeline = producerClient.pipeline();
      monitors.forEach((obj) => {
        const entries = Object.entries(obj).flatMap(([k, v]) => [
          k,
          v == null ? "" : String(v),
        ]);
        pipeline.xadd("Orbit:monitors", "*", ...entries);
      });
      await pipeline.exec();
      cursorId = monitors[monitors.length - 1]?.id;
    }
  } catch (error) {
    console.log(error);
  }
}
const publishTask = cron.schedule(
  "*/10 * * * *",
  async () => {
    await publish();
  },
  {
    noOverlap: true,
  },
);
publishTask.start();

async function deleteOlderLogs() {
  const sevenDayAgo = new Date();
  sevenDayAgo.setDate(sevenDayAgo.getDate() - 7);

  await prisma.pingLog.deleteMany({
    where: {
      timestamp: {
        lt: sevenDayAgo,
      },
    },
  });
  console.log("data deleted!");
}
const deleteTask = cron.schedule("0 0 * * *", async () => {
  await deleteOlderLogs();
});
deleteTask.start();
