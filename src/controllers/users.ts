import { isValidObjectId } from "mongoose";
import type { RequestHandler } from "express";

import { UserService } from "@/services/users";
import { validate } from "@/utils/validate";
import { BadRequestError } from "@/utils/errors";
import { asyncHandler } from "@/utils/async-handler";
import { updateUserValidator } from "@/validators/users";

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

    const validation = await validate(updateUserValidator, { name, phone, photoUrl });

    await this.userService.updateUser(id, userId, {
      name: validation.name,
      phone: validation.phone,
      photoUrl: validation.photoUrl
    });

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
