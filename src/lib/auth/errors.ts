export class AuthError extends Error {
  readonly code: string;
  readonly statusCode: number;

  constructor(message: string, code = "UNAUTHORIZED", statusCode = 401) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

export class OrganizationAccessError extends ForbiddenError {
  constructor(message = "Organization access denied") {
    super(message);
    this.name = "OrganizationAccessError";
  }
}
