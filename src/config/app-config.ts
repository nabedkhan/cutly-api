import dotenv from "dotenv";
import path from "node:path";

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../.env.local")
});

export const appConfig = {
  PORT: parseInt(process.env["PORT"] || "5000", 10),
  MONGODB_URI: process.env["MONGODB_URI"]
};
