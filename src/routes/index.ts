import { Router, Request, Response } from "express";

const router: Router = Router();

// Health check endpoint
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Basic API route
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Cutly API - URL Shortener Service",
    version: "1.0.0",
    status: "running"
  });
});

export default router;
