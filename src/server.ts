import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { appConfig } from "@/config/app-config";

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
app.listen(appConfig.PORT, () => {
  console.log(`🚀 Server is running on ${appConfig.PORT}`);
});
