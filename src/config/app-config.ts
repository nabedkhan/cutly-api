import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const appConfig = {
  PORT: parseInt(process.env["PORT"] || "5000", 10),
  MONGODB_URI: process.env["MONGODB_URI"]!,
  JWT_SECRET: process.env["JWT_SECRET"]!,
  APP_URL: process.env["APP_URL"]! || "http://localhost:5000",
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    // sameSite: "strict" as const
  }
};
