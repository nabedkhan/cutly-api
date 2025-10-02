import type { Request, Response, NextFunction } from "express";
import { AppError, NotFoundError } from "@/utils/errors";

export function notFoundMiddleware(req: Request, _res: Response, next: NextFunction) {
  const error = new NotFoundError(`Resource not found: ${req.originalUrl}`);
  next(error);
}

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message,
      issues: err.issues
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.status).json({
      code: err.code,
      message: err.message
    });
  }

  return res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: err.message
  });
}
