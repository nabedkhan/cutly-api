import { Router, Request, Response } from "express";

import authRoutes from "./auth";
import usersRoutes from "./users";

const router: Router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Users routes
router.use("/users", usersRoutes);

// Health check route
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Basic API route for testing
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Cutly API - URL Shortener Service",
    version: "1.0.0",
    status: "running"
  });
});

export default router;
