import { z } from "zod";

export const addMonitorSchema = z.object({
  name: z
    .string({ error: "Name Must Be Valid String" })
    .max(100, { error: "Monitor Name Is Too Long" }),
  url: z.url({ error: "Invalid URL" }),
  email: z.email(),
});

export const paramsSchema = z.object({
  monitorId: z.uuid({ error: "Invalid Monitor ID In Params" }),
});
export const monitorStatusSchema = z.object({
  monitorId: z.uuid({ error: "Invalid Monitor ID In Params" }),
  status: z.enum(["PAUSED", "UP"], { error: "Not a valid status" }),
});
export const pingDataQuerySchema = z.object({
  days: z.coerce.number().min(1).max(7).default(1),
});
