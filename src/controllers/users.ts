import { treeifyError } from "zod/v4";
import { isValidObjectId } from "mongoose";
import type { RequestHandler } from "express";

import { UserService } from "@/services/users";
import { asyncHandler } from "@/utils/async-handler";
import { updateUserValidator } from "@/validators/users";
import { BadRequestError, ValidationError } from "@/utils/errors";

export class UsersController {
  constructor(private readonly userService: UserService) {}

  getUsers: RequestHandler = asyncHandler(async (_req, res) => {
    const users = await this.userService.getUsers();
    res.json({
      success: true,
      message: "List of users fetched successfully",
      data: { users }
    });
  });

  getUser: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
      throw new BadRequestError("Invalid request");
    }

    const user = await this.userService.getUser(id);

    res.json({
      success: true,
      message: "User fetched successfully",
      data: { user }
    });
  });

  updateUser: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;

    if (!isValidObjectId(id)) {
      throw new BadRequestError("Invalid request");
    }

    const { name, phone, photoUrl } = req.body || {};

    const validation = updateUserValidator.safeParse({ name, phone, photoUrl });
    if (!validation.success) {
      throw new ValidationError(treeifyError(validation.error));
    }

    await this.userService.updateUser(id, userId, { name, phone, photoUrl });

    res.json({
      success: true,
      message: "User updated successfully"
    });
  });

  deleteUser: RequestHandler = asyncHandler(async (req, res) => {
    const { id } = req.params as { id: string };

    if (!isValidObjectId(id)) {
      throw new BadRequestError("Invalid request");
    }

    await this.userService.deleteUser(id);

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  });
}
