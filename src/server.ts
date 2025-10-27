import { createApp } from "@/app";
import { logger } from "@/lib/winston";
import { connectDB, disconnectDB } from "@/lib/mongoose";
import { appConfig } from "@/config/app-config";

async function main() {
  try {
    const app = createApp();

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
