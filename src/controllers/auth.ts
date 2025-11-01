import type { RequestHandler } from "express";
import { treeifyError } from "zod/v4";

import { ValidationError } from "@/utils/errors";
import { asyncHandler } from "@/utils/async-handler";
import { loginValidator, registerValidator } from "@/validators/auth";
import { appConfig } from "@/config/app-config";
import { ServiceAuth } from "@/interfaces/auth";

export class AuthController {
  constructor(private readonly authService: ServiceAuth) {}

  register: RequestHandler = asyncHandler(async (req, res) => {
    const { name, password, email } = req.body || {};

    const validation = registerValidator.safeParse({ name, password, email });
    if (!validation.success) {
      throw new ValidationError(treeifyError(validation.error));
    }

    const createdUser = await this.authService.register({ email, name, password });

    res.status(201).json({
      success: true,
      data: createdUser,
      message: "User registered successfully"
    });
  });

  login: RequestHandler = asyncHandler(async (req, res) => {
    const { password, email } = req.body || {};

    const validation = loginValidator.safeParse({ password, email });
    if (!validation.success) {
      throw new ValidationError(treeifyError(validation.error));
    }

    const { token, user } = await this.authService.login({ email, password });

    res.cookie("token", token, appConfig.COOKIE_OPTIONS);

    res.json({
      success: true,
      message: "User logged in successfully",
      data: { token, user }
    });
  });

  logout: RequestHandler = asyncHandler((_req, res) => {
    res.clearCookie("token");
    res.json({
      success: true,
      message: "User logged out successfully"
    });
  });
}
