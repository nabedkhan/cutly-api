import { treeifyError } from "zod/v4";
import type { RequestHandler } from "express";

import { User } from "@/models/User";
import { asyncHandler } from "@/utils/async-handler";
import { updateUserValidator } from "@/validators/users";
import { BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "@/utils/errors";

export const getUsers: RequestHandler = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password -__v");
  res.json({
    success: true,
    message: "List of users fetched successfully",
    data: { users }
  });
});

export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params || {};
  if (!id) {
    throw new BadRequestError("Invalid request");
  }

  const user = await User.findById(id).select("-password -__v");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({
    success: true,
    message: "User fetched successfully",
    data: { user }
  });
});

export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  if (!id) {
    throw new BadRequestError("Invalid request");
  }

  const { name, phone, photoUrl } = req.body || {};

  const validation = updateUserValidator.safeParse({ name, phone, photoUrl });
  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  if (phone) {
    const phoneAlreadyExists = await User.findOne({ phone }).select("_id");
    if (phoneAlreadyExists) {
      throw new BadRequestError("Phone number already taken");
    }
  }

  const userExists = await User.findById(id).select("_id");
  if (!userExists) {
    throw new NotFoundError("Invalid request");
  }

  if (userId !== userExists.id) {
    throw new ForbiddenError("Forbidden access! You are not authorized to access this resource");
  }

  await User.updateOne({ _id: id }, { name, phone, photoUrl });

  res.json({
    success: true,
    message: "User updated successfully",
    data: { _id: userExists.id }
  });
});

export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params || {};
  if (!id) {
    throw new BadRequestError("Invalid request");
  }

  const user = await User.findByIdAndDelete(id).select("_id");
  if (!user) {
    throw new NotFoundError("User not found");
  }

  res.json({
    success: true,
    message: "User deleted successfully",
    data: null
  });
});
