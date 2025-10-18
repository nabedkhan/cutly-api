import { Router } from "express";

import authRoutes from "./auth";
import usersRoutes from "./users";
import linksRoutes from "./links";

const router: Router = Router();

// Auth routes
router.use("/auth", authRoutes);

// Users routes
router.use("/users", usersRoutes);

// Links routes
router.use("/links", linksRoutes);

export default router;
