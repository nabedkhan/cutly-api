import { isValidObjectId } from "mongoose";
import type { RequestHandler } from "express";

import { LinksService } from "@/services/links";
import { validate } from "@/utils/validate";
import { BadRequestError } from "@/utils/errors";
import { asyncHandler } from "@/utils/async-handler";
import { createLinkValidator, updateLinkValidator } from "@/validators/links";
import { RequestQuery } from "@/types/request";

export const getLinks: RequestHandler = asyncHandler(async (req, res) => {
  const query = req.query as RequestQuery;

  const page = parseInt(query.page || "1");
  const limit = parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  const { links, total, totalPages, hasNextPage, hasPreviousPage, nextPage, previousPage } =
    await LinksService.getLinks({ page, limit, skip });

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
  const { id } = req.params as { id: string };

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid request");
  }

  const userId = req.user?.role !== "ADMIN" ? req.user?.id : undefined;

  const link = await LinksService.getLink(id, userId);

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

  const { links, total, totalPages, hasNextPage, hasPreviousPage, nextPage, previousPage } =
    await LinksService.getLinks({
      userId: req.user.id,
      page,
      limit,
      skip
    });

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

  const validation = await validate(createLinkValidator, { title, destinationUrl, backHalf });

  const createdLink = await LinksService.createLink({
    title: validation.title,
    backHalf: validation.backHalf!,
    destinationUrl: validation.destinationUrl,
    userId: req.user!.id
  });

  res.json({
    success: true,
    message: "Link created successfully",
    data: { link: createdLink }
  });
});

export const updateLink: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = req.user!.id;

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid request");
  }

  const { title, destinationUrl, backHalf } = req.body || {};

  await validate(updateLinkValidator, { title, destinationUrl, backHalf });

  await LinksService.updateLink(id, { title, destinationUrl, backHalf, userId });

  res.json({
    success: true,
    message: "Link updated successfully"
  });
});

export const deleteLink: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params as { id: string };
  const userId = req.user!.id;

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid request");
  }

  await LinksService.deleteLink(id, userId);

  res.json({
    success: true,
    message: "Link deleted successfully"
  });
});
