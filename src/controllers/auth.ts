import type { Request, Response } from "express";
import { treeifyError } from "zod";

import { asyncHandler } from "@/utils/async-handler";
import { ValidationError } from "@/utils/errors";
import { loginValidator, registerValidator } from "@/validators/auth";

export const register = asyncHandler((req: Request, res: Response) => {
  const { name, password, email } = req.body;

  const validation = registerValidator.safeParse({ name, password, email });
  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  res.status(200).json({
    status: "success",
    message: "User registered successfully",
    data: req.body
  });
});

export const login = asyncHandler((req: Request, res: Response) => {
  const { password, email } = req.body;

  const validation = loginValidator.safeParse({ password, email });
  if (!validation.success) {
    throw new ValidationError(treeifyError(validation.error));
  }

  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    data: req.body
  });
});

export async function logout(req: Request, res: Response) {
  try {
    res.status(200).json({
      status: "success",
      message: "User logged out successfully",
      data: req.body
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}
