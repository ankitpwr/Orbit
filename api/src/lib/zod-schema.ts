import { z } from "zod";

export const addMonitorSchema = z.object({
  name: z
    .string({ error: "Name Must Be Valid String" })
    .max(100, { error: "Monitor Name Is Too Long" }),
  url: z.url({ error: "Invalid URL" }),
  primaryEmail: z.email(),
  esacalationEmail1: z.email().optional(),
  esacalationEmail2: z.email().optional(),
});

export const paramsSchema = z.object({
  monitorId: z.uuid({ error: "Invalid Monitor ID In Params" }),
});
export const monitorStatusSchema = z.object({
  monitorId: z.uuid({ error: "Invalid Monitor ID In Params" }),
  status: z.enum(["PAUSED", "UP"], { error: "Not a valid status" }),
});
export const pingDataQuerySchema = z.object({
  days: z.coerce.number().min(1).max(30).default(1),
});

export const updateUserDetailsSchema = z.object({
  name: z
    .string({ error: "Name must be valid string" })
    .max(100, { error: "Name can be of maximum 100 characters" }),
});
