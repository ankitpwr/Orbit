import { z } from "zod";

export const addMonitorSchema = z.object({
  name: z
    .string({ error: "Name Must Be Valid String" })
    .max(100, { error: "Monitor Name Is Too Long" }),
  url: z.url({ error: "Invalid URL" }),
  email: z.email(),
});

export const deleteMonitorSchema = z.object({
  monitorId: z.uuid({ error: "Invalid Monitor ID In Params" }),
});

export const monitorDetailsSchema = z.object({
  monitorId: z.uuid({ error: "Invalid Monitor ID In Params" }),
});
