import type { Request, Response, NextFunction } from "express";

type AsyncFunc = (req: Request, res: Response, next: NextFunction) => Promise<void> | void;

export function asyncHandler(func: AsyncFunc) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}
