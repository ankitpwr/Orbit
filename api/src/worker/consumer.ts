import { prisma } from "../lib/prisma.js";
import { consumerClient } from "../lib/redis.js";
import cron from "node-cron";
import axios from "axios";
import { forEachChild } from "typescript";

async function consumer() {
  console.log("consumer start");
  try {
    const data = await consumerClient.xreadgroup(
      "GROUP",
      "monitor-group-1",
      "worker-1",
      "COUNT",
      "2",
      "BLOCK",
      "10000",
      "STREAMS",
      "Orbit:monitors",
      ">",
    );
    if (!data) return;

    //@ts-ignore
    for (const [stream, entries] of data) {
      let monitorId: string = "";
      let url: string = "";
      for (const [id, fields] of entries) {
        console.log("id is ", id);
        for (let i = 0; i < fields.length; i += 2) {
          monitorId = fields[i];
          url = fields[i + 1];
        }
      }
      console.log("monitor id is", monitorId);
      console.log("url is ", url);
    }
  } catch (error) {
    console.log("error !", error);
  }
}

consumer();

// cron.schedule("*/3 * * * *", consumer);
