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

function getEscalationLevel(alertCount: number): number {
  if (alertCount < 1) return 1;
  if (alertCount < 2) return 2;
  return 3;
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
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    await prisma.$transaction(async (tx) => {
      const alertIncident = await tx.incident.findMany({
        where: {
          OR: [
            { currentStatus: "OPEN" },
            {
              currentStatus: "ACKNOWLEDGED",
              alertCount: { lt: 3 },
              lastAlertSentAt: { lt: thirtyMinutesAgo },
            },
          ],
        },
        select: { monitorId: true, alertCount: true, id: true },
      });

      if (alertIncident.length === 0) return;
      const escalationMap = new Map<string, number>(
        alertIncident.map((inc) => [
          inc.monitorId,
          getEscalationLevel(inc.alertCount),
        ]),
      );

      const allChannels = await tx.notificationChannel.findMany({
        where: { monitorId: { in: alertIncident.map((obj) => obj.monitorId) } },
        select: {
          monitorId: true,
          channelType: true,
          channelValue: true,
          priority: true,
          monitor: {
            select: { name: true, url: true, lastChecked: true },
          },
        },
      });

      const channelMap = new Map<string, (typeof allChannels)[0]>();
      allChannels.forEach((ch) => {
        const targetPriority = escalationMap.get(ch.monitorId);
        if (ch.priority == targetPriority) {
          channelMap.set(ch.monitorId, ch);
        }
      });

      await tx.incident.updateMany({
        where: { id: { in: alertIncident.map((obj) => obj.id) } },
        data: {
          lastAlertSentAt: new Date(),
          alertCount: { increment: 1 },
          currentStatus: "ACKNOWLEDGED",
        },
      });

      let alertMonitorData: DownMonitor[] = [];
      channelMap.forEach((obj) => {
        let notificationData: DownMonitor = {
          channelType: obj.channelType,
          channelValue: obj.channelValue,
          name: obj.monitor.name,
          url: obj.monitor.url,
          lastChecked: obj.monitor.lastChecked,
        };
        alertMonitorData.push(notificationData);
      });
      await emitNoticationEvent(alertMonitorData);
    });
  } catch (error) {
    console.log("error !", error);
  }
}

const alert = cron.schedule("*/2 * * * *", async () => {
  findMonitorsToAlert();
});

alert.start();
