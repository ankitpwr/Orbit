import Redis from "ioredis";

const HOST = "alpine-redis";

export const producerClient = new Redis.default({
  host: HOST,
  port: 6379,
});

export const consumerClient = new Redis.default({
  host: HOST,
  port: 6379,
});

export const notificationClient = new Redis.default({
  host: HOST,
  port: 6379,
});

export const outboxClient = new Redis.default({
  host: HOST,
  port: 6379,
});

export const subscriber = new Redis.default({
  host: HOST,
  port: 6379,
});

export const cacheClient = new Redis.default({
  host: HOST,
  port: 6379,
});

async function initializeStreams() {
  try {
    await cacheClient.xgroup(
      "CREATE",
      "Orbit:monitors",
      "monitor-group-1",
      "$",
      "MKSTREAM",
    );
    await cacheClient.xgroup(
      "CREATE",
      "Orbit:notification",
      "notification-group-1",
      "$",
      "MKSTREAM",
    );
    console.log("Consumer groups initialized successfully.");
  } catch (error: any) {
    if (error.message && error.message.includes("BUSYGROUP")) {
      console.log("Consumer groups already exist.");
    } else {
      console.error("Failed to initialize Redis streams:", error);
    }
  }
}

await initializeStreams();
