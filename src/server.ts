import { createApp } from "@/app";
import { logger } from "@/lib/winston";
import { MongoDatabase } from "@/lib/mongoose";
import { appConfig } from "@/config/app-config";
import { shutdown } from "@/utils/shutdown";

async function main() {
  try {
    const app = createApp();

    // Connect to database
    const db = new MongoDatabase(appConfig.MONGODB_URI);
    await db.connect();

    // Start server
    const server = app.listen(appConfig.PORT, () => {
      logger.info(`🚀 Server is running on ${appConfig.PORT}`);
    });

    // Graceful shutdown
    shutdown(db.disconnect, server);
  } catch (error) {
    process.exit(1);
  }
}

main();
