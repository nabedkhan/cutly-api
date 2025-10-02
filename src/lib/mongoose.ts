import mongoose, { ConnectOptions } from "mongoose";

import { logger } from "@/lib/winston";
import { appConfig } from "@/config/app-config";

const connectOptions: ConnectOptions = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true
  }
};

export async function connectDB() {
  if (!appConfig.MONGODB_URI) {
    throw new Error("Database URI is not defined in the environment variables");
  }

  try {
    await mongoose.connect(appConfig.MONGODB_URI, connectOptions);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Error connecting to database", error);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error("Error disconnecting from database", error);
    throw error;
  }
}
