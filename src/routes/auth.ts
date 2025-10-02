import { Router } from "express";

import * as authController from "@/controllers/auth";

const router: Router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

export default router;
