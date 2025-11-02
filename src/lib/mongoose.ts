import mongoose from "mongoose";
import { logger } from "@/lib/winston";

export class MongoDatabase {
  private uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async connect() {
    try {
      if (!this.uri) {
        throw new Error("Database URI is not defined in the environment variables");
      }

      await mongoose.connect(this.uri, {
        serverApi: {
          version: "1",
          strict: true,
          deprecationErrors: true
        }
      });

      logger.info("Database connected successfully");
    } catch (error) {
      logger.error("Error connecting to database", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info("Database disconnected successfully");
    } catch (error) {
      logger.error("Error disconnecting from database", error);
      throw error;
    }
  }
}
