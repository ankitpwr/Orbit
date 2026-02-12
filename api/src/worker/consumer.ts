import { prisma } from "../lib/prisma.js";
import { consumerClient } from "../lib/redis.js";
import axios, { AxiosError } from "axios";

interface Response {
  statuscode: number;
}

async function sendRequest(url: string): Promise<Response> {
  try {
    const response = await axios.get(`${url}/health-check`);
    return { statuscode: response.status };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("error code", error.code);
      return { statuscode: error.response?.status || 500 };
    }
    return { statuscode: 500 };
  }
}

async function storeResult(monitorId: string, statusCode: number) {
  const code = statusCode == 200 ? "UP" : "DOWN";
  const res = await prisma.$transaction([
    prisma.pingLog.create({
      data: {
        monitorId: monitorId,
        statusCode: statusCode,
      },
    }),

    prisma.monitor.update({
      where: { id: monitorId },
      data: {
        status: code,
      },
    }),
  ]);
}

async function consumer() {
  console.log("consumer start");
  try {
    const data = await consumerClient.xreadgroup(
      "GROUP",
      "monitor-group-1",
      "worker-1",
      "COUNT",
      "1",
      "BLOCK",
      "10000",
      "STREAMS",
      "Orbit:monitors",
      ">",
    );
    if (!data) return;

    //@ts-ignore
    for (const [stream, entries] of data) {
      for (const [id, fields] of entries) {
        const monitorData: Record<string, string> = {};
        for (let i = 0; i < fields.length; i += 2) {
          monitorData[fields[i]] = fields[i + 1];
        }
        const url = monitorData.url;
        const monitorId = monitorData.id;
        if (url && monitorId) {
          const code = await sendRequest(url);
          await storeResult(monitorId, code.statuscode);
        }
      }
    }
  } catch (error) {
    console.log("error !", error);
  }
}

consumer();
