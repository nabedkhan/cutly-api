import { z, treeifyError } from "zod/v4";
import { ValidationError } from "@/utils/errors";

export async function validate<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  const validation = await schema.safeParseAsync(data);

  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  return validation.data;
}
