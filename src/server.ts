import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { logger } from "@/lib/winston";
import { connectDB, disconnectDB } from "@/lib/mongoose";

import { appConfig } from "@/config/app-config";
import { errorMiddleware, notFoundMiddleware } from "@/middlewares/error";

import apiRoutes from "@/routes";
import rootRoutes from "@/routes/root";

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

async function main() {
  try {
    // Connect to database
    await connectDB();

    // Start server
    const server = app.listen(appConfig.PORT, () => {
      logger.info(`🚀 Server is running on ${appConfig.PORT}`);
    });

    // Graceful shutdown
    const processTermination = (event: string) => {
      logger.info(`${event} signal received: shutting down gracefully`);
      server.close(() => {
        disconnectDB();
        logger.info("Server closed successfully");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => processTermination("SIGTERM"));
    process.on("SIGINT", () => processTermination("SIGINT"));
  } catch (error) {
    process.exit(1);
  }
}

main();
