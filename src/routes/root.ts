import { Router, Request, Response } from "express";

import { Link } from "@/models/Link";
import { NotFoundError } from "@/utils/errors";
import { asyncHandler } from "@/utils/async-handler";

const router: Router = Router();

// Redirect route
router.get(
  "/:backHalf",
  asyncHandler(async (req: Request, res: Response) => {
    const { backHalf } = req.params;

    const link = await Link.findOne({ backHalf });
    if (!link) {
      throw new NotFoundError("Link does not exist");
    }

    await Link.updateOne({ _id: link._id }, { $inc: { totalVisits: 1 } });

    res.redirect(link.destinationUrl);
  })
);

// Health check route
router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Basic API route for testing
router.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Cutly API - URL Shortener Service",
    version: "1.0.0",
    status: "running"
  });
});

export default router;
