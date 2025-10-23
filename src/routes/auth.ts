import { Router } from "express";

// import * as authController from "@/controllers/auth";
import { AuthController } from "@/controllers/auth";
import { authMiddleware } from "@/middlewares/auth";

const router: Router = Router();

// Register route: '/api/auth/register'
router.post("/register", AuthController.register);

// Login route: '/api/auth/login'
router.post("/login", AuthController.login);

// Logout route: '/api/auth/logout'
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
