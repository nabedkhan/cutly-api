import type { Request, Response, NextFunction } from "express";

type Func = (req: Request, res: Response, next: NextFunction) => void;

export function asyncHandler(func: Func) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}
