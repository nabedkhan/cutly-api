import type { Request, Response, NextFunction } from "express";

import { verifyToken } from "@/lib/jsonwebtoken";
import { ForbiddenError, UnauthorizedError } from "@/utils/errors";
import { RequestCookies } from "@/types/request";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const { token } = req.cookies as RequestCookies;
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

export function adminMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    throw new ForbiddenError();
  }

  next();
}
