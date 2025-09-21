import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { appConfig } from "@/config/app-config";
import { logger } from "@/lib/winston";

import apiRoutes from "@/routes";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes handling
app.use("/api", apiRoutes);

// Start server
const server = app.listen(appConfig.PORT, () => {
  logger.info(`🚀 Server is running on ${appConfig.PORT}`);
});

// Graceful shutdown
const processTermination = (event: string) => {
  logger.error(`${event} signal received: shutting down gracefully`);
  server.close(() => {
    logger.error("Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => processTermination("SIGTERM"));
process.on("SIGINT", () => processTermination("SIGINT"));
