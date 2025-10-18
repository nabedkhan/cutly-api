import crypto from "crypto";

export function generateBackHalf(length: number = 3): string {
  return crypto.randomBytes(length).toString("hex");
}
