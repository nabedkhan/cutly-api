type ErrorCode = "BAD_REQUEST" | "UNAUTHORIZED" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  status: number;
  code: ErrorCode;
  issues?: string | object | undefined;

  constructor(
    message: string,
    statusCode = 500,
    code: ErrorCode = "INTERNAL_SERVER_ERROR",
    issues?: string | object
  ) {
    super(message);
    this.code = code;
    this.status = statusCode;
    this.issues = issues;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request Error") {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized Access! Please login to continue") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ValidationError extends AppError {
  constructor(issues: string | object, message = "Validation Error") {
    super(message, 400, "BAD_REQUEST", issues);
  }
}
