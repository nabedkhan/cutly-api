import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "@/lib/jsonwebtoken";
import { UnauthorizedError } from "@/utils/errors";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies["token"];
  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;

    next();
  } catch (error) {
    throw new UnauthorizedError("Token is invalid");
  }
}
