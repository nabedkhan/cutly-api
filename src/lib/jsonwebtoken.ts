import jwt from "jsonwebtoken";
import { appConfig } from "@/config/app-config";
import type { DecodedToken } from "@/types/token";

export const generateToken = (payload: string | object | Buffer) => {
  return jwt.sign(payload, appConfig.JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, appConfig.JWT_SECRET) as DecodedToken;
};
