import type { RequestHandler } from "express";

import { AuthService } from "@/services/auth";
import { validate } from "@/utils/validate";
import { asyncHandler } from "@/utils/async-handler";
import { loginValidator, registerValidator } from "@/validators/auth";
import { appConfig } from "@/config/app-config";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register: RequestHandler = asyncHandler(async (req, res) => {
    const { name, password, email } = req.body || {};

    const validation = await validate(registerValidator, { name, password, email });

    const createdUser = await this.authService.register({
      email: validation.email,
      name: validation.name,
      password: validation.password
    });

    res.status(201).json({
      success: true,
      data: createdUser,
      message: "User registered successfully"
    });
  });

  login: RequestHandler = asyncHandler(async (req, res) => {
    const { password, email } = req.body || {};

    const validation = await validate(loginValidator, { password, email });

    const { token, user } = await this.authService.login({
      email: validation.email,
      password: validation.password
    });

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
