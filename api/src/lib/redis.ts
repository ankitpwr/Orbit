import Redis from "ioredis";

export const producerClient = new Redis.default({
  host: "localhost",
  port: 6379,
});

export const consumerClient = new Redis.default({
  host: "localhost",
  port: 6379,
});

export const notificationClient = new Redis.default({
  host: "localhost",
  port: 6379,
});

export const outboxClient = new Redis.default({
  host: "localhost",
  port: 6379,
});
