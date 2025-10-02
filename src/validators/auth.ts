import * as z from "zod";

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
  email: z.string({ error: "Email is required!" }).trim().email("Invalid email address")
});

export const loginValidator = z.object({
  password: z
    .string({ error: "Password is required!" })
    .trim()
    .min(6, "Password must be 6 characters length"),
  // email: z.string({ error: "Email is required!" }).trim().email("Invalid email address")
  email: z.email({ error: "Invalid email address" }).trim()
});
