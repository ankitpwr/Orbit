import cron from "node-cron";
import { prisma } from "../lib/prisma.js";
import { producerClient } from "../lib/redis.js";

try {
  async function publish() {
    const monitor = await prisma.monitor.findMany({
      select: { id: true, url: true },
    });
    console.log(monitor);
    const pipeline = producerClient.pipeline();
    monitor.forEach((obj) => {
      const entries = Object.entries(obj).flatMap(([k, v]) => [
        k,
        v == null ? "" : String(v),
      ]);
      pipeline.xadd("Orbit:monitors", "*", ...entries);
    });

    await pipeline.exec();
  }
  cron.schedule("*/2 * * * *", publish);
} catch (error) {
  console.log("error !");
  console.log(error);
}
