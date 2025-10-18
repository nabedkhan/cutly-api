import { treeifyError } from "zod/v4";
import { isValidObjectId } from "mongoose";
import type { RequestHandler } from "express";

import { Link } from "@/models/Link";
import { asyncHandler } from "@/utils/async-handler";
import { BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "@/utils/errors";
import { createLinkValidator, updateLinkValidator } from "@/validators/links";
import { generateBackHalf } from "@/utils/back-half";
import { appConfig } from "@/config/app-config";
import { RequestQuery } from "@/types/request";

export const getLinks: RequestHandler = asyncHandler(async (req, res) => {
  const query = req.query as RequestQuery;

  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const links = await Link.find()
    .select("title backHalf shortUrl destinationUrl totalVisits _id userId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Link.countDocuments();

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  res.json({
    success: true,
    message: "List of links fetched successfully",
    data: {
      links,
      pagination: {
        totalPages,
        currentPage: page,
        total,
        nextPage,
        previousPage,
        hasNextPage,
        hasPreviousPage
      }
    }
  });
});

export const getLink: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid request");
  }

  const link = await Link.findOne({
    _id: id,
    userId: req.user?.role !== "ADMIN" ? req.user?.id : undefined
  });

  if (!link) {
    throw new NotFoundError("Link not found");
  }

  res.json({
    success: true,
    message: "Link fetched successfully",
    data: { link }
  });
});

export const getLinksByUser: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    throw new BadRequestError("Invalid request");
  }

  const query = req.query as RequestQuery;

  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const links = await Link.find({ userId: req.user.id })
    .select("title backHalf shortUrl destinationUrl totalVisits _id userId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Link.countDocuments({ userId: req.user.id });

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;

  res.json({
    success: true,
    message: "User's links fetched successfully",
    data: {
      links,
      pagination: {
        totalPages,
        currentPage: page,
        total,
        nextPage,
        previousPage,
        hasNextPage,
        hasPreviousPage
      }
    }
  });
});

export const createLink: RequestHandler = asyncHandler(async (req, res) => {
  const { title, destinationUrl, backHalf } = req.body || {};

  const validation = createLinkValidator.safeParse({ title, destinationUrl, backHalf });
  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  const createdBackHalf = backHalf || generateBackHalf();

  const linkExists = await Link.findOne({ backHalf: createdBackHalf });
  if (linkExists) {
    throw new BadRequestError("Back half already exists");
  }

  const createdLink = await Link.create({
    title,
    destinationUrl,
    backHalf: createdBackHalf,
    shortUrl: `${appConfig.APP_URL}/${createdBackHalf}`,
    userId: req.user!.id
  });

  res.json({
    success: true,
    message: "Link created successfully",
    data: { link: createdLink }
  });
});

export const updateLink: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid request");
  }

  const { title, destinationUrl, backHalf } = req.body || {};

  const validation = updateLinkValidator.safeParse({ title, destinationUrl, backHalf });
  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  const linkExists = await Link.findById(id).select("_id userId");
  if (!linkExists) {
    throw new NotFoundError("Link does not exist");
  }

  if (backHalf) {
    const backHalfExists = await Link.findOne({ backHalf });
    if (backHalfExists) {
      throw new BadRequestError("Back half already exists");
    }
  }

  if (userId.toString() !== linkExists.userId.toString()) {
    throw new ForbiddenError("Forbidden access! You are not authorized to update operation");
  }

  await Link.updateOne({ _id: id }, { title, destinationUrl, backHalf });

  res.json({
    success: true,
    message: "Link updated successfully",
    data: {
      link: {
        id: linkExists._id
      }
    }
  });
});

export const deleteLink: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid request");
  }

  const linkExists = await Link.findOne({ _id: id, userId }).select("_id userId");
  if (!linkExists) {
    throw new NotFoundError("Link does not exist");
  }

  await Link.deleteOne({ _id: id });

  res.json({
    success: true,
    message: "Link deleted successfully",
    data: null
  });
});
