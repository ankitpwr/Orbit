import { sendEmail } from "../email/email.js";
import { prisma } from "../lib/prisma.js";
import { notificationClient } from "../lib/redis.js";

async function sendNotification() {
  try {
    const data = await notificationClient.xreadgroup(
      "GROUP",
      "notification-group-1",
      "worker-1",
      "COUNT",
      "1",
      "BLOCK",
      "10000",
      "STREAMS",
      "Orbit:notification",
      ">",
    );

    if (!data) {
      console.log("empty data");
      return;
    }

    //@ts-ignore
    for (const [stream, entries] of data) {
      entries.map(async ([id, fields]: [string, string[]]) => {
        const monitor: Record<string, string> = {};

        for (let i = 0; i < fields.length; i += 2) {
          monitor[fields[i]!] = fields[i + 1]!;
        }
        const monitorName = monitor.name;
        const monitorUrl = monitor.url;
        const downSince = monitor.statusChangedAt;
        const email = monitor.email;
        const monitorId = monitor.id;

        console.log(
          "monitorName ",
          monitorName,
          "monitorUrl",
          monitorUrl,
          "downSince",
          downSince,
        );
        if (monitorName && monitorUrl && downSince && email && monitorId) {
          await sendEmail(email, monitorName, monitorUrl, downSince);
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function startNotificationWorker() {
  while (true) {
    try {
      await sendNotification();
    } catch (error) {
      console.log("error in worker !", error);
    }
  }
}
startNotificationWorker();
