import { Router } from "express";

import * as authController from "@/controllers/auth";
import { authMiddleware } from "@/middlewares/auth";

const router: Router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authMiddleware, authController.logout);

export default router;
