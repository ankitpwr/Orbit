import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string(),
  email: z.email({ error: "Invalid Email" }).trim(),
  password: z
    .string()
    .min(3, { error: "Password must contain atleast 3 characters" })
    .max(100, { error: "Password length should not exceed 100" }),
});
