import { z } from "zod/v4";

export const updateUserValidator = z.object({
  name: z.string().trim().max(25, "Maximum 25 characters allowed").optional(),
  phone: z.string().trim().max(16, "Maximum 16 characters allowed").optional(),
  photoUrl: z.string().trim().optional()
});
