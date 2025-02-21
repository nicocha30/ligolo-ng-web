import { AppError, HttpError } from "@/errors/index.tsx";

export class InvalidCredentialsError extends HttpError {
  public statusCode = 403;
  public name = "Invalid Credentials";
  public message = "Please check your login information";
}

export class SessionParseFailedError extends AppError {
  public name = "Unable to parse session data";

  constructor(message: string) {
    super();
    this.message = message;
  }
}
