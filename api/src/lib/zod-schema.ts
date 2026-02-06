import { z } from "zod";

export const addMonitorSchema = z.object({
  name: z
    .string({ error: "Name Must Be Valid String" })
    .max(100, { error: "Monitor Name Is Too Long" }),
  url: z.url({ error: "Invalid URL" }),
});

export const deleteMonitorSchema = z.object({
  monitorId: z.uuid({ error: "Invalid Monitor ID In Params" }),
});
