import express, { Application } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { errorMiddleware, notFoundMiddleware } from "@/middlewares/error";

import apiRoutes from "@/routes";
import rootRoutes from "@/routes/root";

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes handling
  app.use("/api", apiRoutes);

  // Redirect, health check and basic API routes
  app.use(rootRoutes);

  // Not found middleware
  app.use(notFoundMiddleware);

  // Global error handler
  app.use(errorMiddleware);

  return app;
}
