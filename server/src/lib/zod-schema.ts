import { z } from "zod";

export const addMonitorSchema = z.object({
  name: z
    .string({ message: "Name must be valid string" })
    .max(100, { message: "Monitor name is too long" }),
  url: z.url({ message: "Invalid url" }),
  primaryEmail: z.email({ message: "Invalid email" }),
  timezone: z.string({ message: "Invalid timezone" }),
  esacalationEmail1: z.email({ message: "Invalid email" }).optional(),
  esacalationEmail2: z.email({ message: "Invalid email" }).optional(),
});

export const paramsSchema = z.object({
  monitorId: z.uuid({ message: "Invalid monitor id in params" }),
});
export const monitorStatusSchema = z.object({
  monitorId: z.uuid({ message: "Invalid monitor id in params" }),
  status: z.enum(["PAUSED", "UP"], { message: "Invalid monitor status" }),
});
export const pingDataQuerySchema = z.object({
  days: z.coerce
    .number()
    .min(1, { message: "Minimum 1 day is required" })
    .max(30, { message: "Maximum 30 is required" })
    .default(1),
});

export const updateUserDetailsSchema = z.object({
  name: z
    .string({ message: "Name must be valid string" })
    .max(100, { message: "Name can be of maximum 100 characters" }),
  timezone: z.string({ message: "Not a valid timezone" }),
});

export const incidentParamsSchema = z.object({
  incidentId: z.uuid({ message: "Invalid monitor id in params" }),
});

export const updateIncidentStatusSchema = z.object({
  status: z.enum(["OPEN", "RESOLVED", "ACKNOWLEDGED"], {
    message: "Not a valid status",
  }),
});
