import type { Request } from "express";
import type { DecodedToken } from "./token";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

export {};
