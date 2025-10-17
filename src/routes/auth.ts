import { Router } from "express";

import * as authController from "@/controllers/auth";
import { authMiddleware } from "@/middlewares/auth";

const router: Router = Router();

// Register route: '/api/auth/register'
router.post("/register", authController.register);

// Login route: '/api/auth/login'
router.post("/login", authController.login);

// Logout route: '/api/auth/logout'
router.post("/logout", authMiddleware, authController.logout);

export default router;
