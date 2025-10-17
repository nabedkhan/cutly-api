import type { RequestHandler } from "express";
import { treeifyError } from "zod/v4";

import { User } from "@/models/User";
import { generateToken } from "@/lib/jsonwebtoken";
import { asyncHandler } from "@/utils/async-handler";
import { BadRequestError, ValidationError } from "@/utils/errors";
import { loginValidator, registerValidator } from "@/validators/auth";

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const { name, password, email } = req.body;

  const validation = registerValidator.safeParse({ name, password, email });
  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new BadRequestError("Invalid email or password");
  }

  const createdUser = await User.create({ name, password, email });

  await createdUser.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email
    }
  });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const { password, email } = req.body;

  const validation = loginValidator.safeParse({ password, email });
  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  const user = await User.findOne({ email }).select("password role name email");
  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid email or password");
  }

  const payload = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email
  };

  const token = generateToken(payload);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    message: "User logged in successfully",
    data: { token, user: payload }
  });
});

export const logout: RequestHandler = asyncHandler((_req, res) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "User logged out successfully",
    data: null
  });
});
