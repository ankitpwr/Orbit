import type { ChannelType } from "../generated/prisma/enums.js";
import cron from "node-cron";
import { prisma } from "../lib/prisma.js";
import { outboxClient } from "../lib/redis.js";

interface DownMonitor {
  name: string;
  url: string;
  channelType: ChannelType;
  channelValue: string;
  lastChecked: Date;
}

//outbox poller worker
async function emitNoticationEvent(downMonitors: DownMonitor[]) {
  console.log("DownMonitor are ", downMonitors);
  const pipeline = outboxClient.pipeline();
  downMonitors.forEach((obj) => {
    const entries = Object.entries(obj).flatMap(([k, v]) => [
      k,
      v == null ? "" : String(v),
    ]);

    pipeline.xadd("Orbit:notification", "MAXLEN", "~", "1000", "*", ...entries);
  });
  await pipeline.exec();
}

async function findMonitorsToAlert() {
  try {
    await prisma.$transaction(async (tx) => {
      const alertMonitor = await tx.incident.findMany({
        where: {
          OR: [
            { currentStatus: "OPEN" },
            { currentStatus: "ACKNOWLEDGED", alertCount: { lte: 3 } },
          ],
        },
        select: { monitorId: true },
      });

      if (alertMonitor.length > 0) {
        const notificationChannel = await tx.notificationChannel.findMany({
          where: {
            monitorId: { in: alertMonitor.map((obj) => obj.monitorId) },
          },
          select: {
            ChannelType: true,
            ChannelValue: true,
            monitor: {
              select: {
                name: true,
                url: true,
                lastChecked: true,
              },
            },
          },
        });
        await tx.incident.updateMany({
          where: {
            monitorId: { in: alertMonitor.map((obj) => obj.monitorId) },
          },
          data: {
            currentStatus: "ACKNOWLEDGED",
            alertCount: { increment: 1 },
          },
        });

        let alertMonitorData: DownMonitor[] = [];
        notificationChannel.forEach((obj) => {
          let notificationData: DownMonitor = {
            channelType: obj.ChannelType,
            channelValue: obj.ChannelValue,
            name: obj.monitor.name,
            url: obj.monitor.url,
            lastChecked: obj.monitor.lastChecked,
          };
          alertMonitorData.push(notificationData);
        });
        await emitNoticationEvent(alertMonitorData);
      }
    });
  } catch (error) {
    console.log("error !", error);
  }
}

const alert = cron.schedule("*/2 * * * *", async () => {
  findMonitorsToAlert();
});

alert.start();
