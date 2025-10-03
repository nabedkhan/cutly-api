import { z } from "zod/v4";

export const registerValidator = z.object({
  name: z
    .string({ error: "Name is required!" })
    .trim()
    .min(1, "Minimum a single character")
    .max(25, "Maximum 25 characters allowed"),
  password: z
    .string({ error: "Password is required!" })
    .trim()
    .min(6, "Password must be 6 characters length"),
  email: z.email({ error: "Invalid email address" }).trim()
});

export const loginValidator = z.object({
  password: z
    .string({ error: "Password is required!" })
    .trim()
    .min(6, "Password must be 6 characters length"),

  email: z.email({ error: "Invalid email address" }).trim()
});
