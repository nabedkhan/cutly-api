import { z } from "zod/v4";

export const createLinkValidator = z.object({
  title: z.string({ error: "Title is required" }).trim().max(55, "Maximum 55 characters allowed"),
  destinationUrl: z.url({ error: "Invalid destination URL" }).trim(),
  backHalf: z.string().trim().max(15, "Maximum 15 characters allowed").optional()
});

export const updateLinkValidator = createLinkValidator.partial();
