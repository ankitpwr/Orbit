import Redis from "ioredis";

const client = new Redis.default();

client.on("error", (error) => {
  console.log("error occured", error);
});

export default client;
