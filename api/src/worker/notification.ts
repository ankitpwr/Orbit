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
      return;
    }

    //@ts-ignore
    for (const [stream, entries] of data) {
      for (const [id, fields] of entries) {
        const monitor: Record<string, string> = {};

        for (let i = 0; i < fields.length; i += 2) {
          monitor[fields[i]!] = fields[i + 1]!;
        }
        const monitorName = monitor.name;
        const monitorUrl = monitor.url;
        const checkedAt = monitor.lastChecked;
        const email = monitor.email;
        const monitorId = monitor.id;

        console.log(
          "monitorName ",
          monitorName,
          "monitorUrl",
          monitorUrl,
          "downSince",
          checkedAt,
        );
        if (monitorName && monitorUrl && checkedAt && email && monitorId) {
          await sendEmail(email, monitorName, monitorUrl, checkedAt);
          await notificationClient.xack(
            "Orbit:notification",
            "notification-group-1",
            id,
          );
        }
      }
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
