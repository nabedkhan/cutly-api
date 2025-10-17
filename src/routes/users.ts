import { Router } from "express";

import * as usersController from "@/controllers/users";
import { adminMiddleware, authMiddleware } from "@/middlewares/auth";

const router: Router = Router();

// Get all users route: '/api/users'
router.get("/", [authMiddleware, adminMiddleware], usersController.getUsers);

// Get user by id route: '/api/users/:id'
router.get("/:id", [authMiddleware, adminMiddleware], usersController.getUser);

// Update user by id route: '/api/users/:id'
router.patch("/:id", authMiddleware, usersController.updateUser);

// Delete user by id route: '/api/users/:id'
router.delete("/:id", [authMiddleware, adminMiddleware], usersController.deleteUser);

export default router;
