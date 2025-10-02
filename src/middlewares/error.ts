import type { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/errors";

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({
      code: err.code,
      message: err.message,
      issues: err.issues
    });

    return;
  }

  res.status(500).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error"
  });
}
