import cron from "node-cron";
import { prisma } from "../lib/prisma.js";
import client from "../lib/redis.js";

try {
  async function publish() {
    const monitor = await prisma.monitor.findMany({});
    console.log(monitor);
    const pipeline = client.pipeline();
    monitor.forEach((obj) => {
      const entries = Object.entries(obj).flatMap(([k, v]) => [
        k,
        v == null ? "" : String(v),
      ]);
      pipeline.xadd("Orbit:monitors", "*", ...entries);
    });

    const data = await pipeline.exec();
  }
  cron.schedule("*/10 * * * *", publish);
} catch (error) {
  console.log("error !");
  console.log(error);
}
