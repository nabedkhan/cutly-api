import { Router } from "express";

import * as linksController from "@/controllers/links";
import { adminMiddleware, authMiddleware } from "@/middlewares/auth";

const router: Router = Router();

// Get links by user id route: '/api/links/user'
router.get("/user", authMiddleware, linksController.getLinksByUser);

// Get all links route: '/api/links'
router.get("/", [authMiddleware, adminMiddleware], linksController.getLinks);

// Create link route: '/api/links'
router.post("/", authMiddleware, linksController.createLink);

// Get link by id route: '/api/links/:id'
router.get("/:id", authMiddleware, linksController.getLink);

// Update link by id route: '/api/links/:id'
router.patch("/:id", authMiddleware, linksController.updateLink);

// Delete link by id route: '/api/links/:id'
router.delete("/:id", authMiddleware, linksController.deleteLink);

export default router;
