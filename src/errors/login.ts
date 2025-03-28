import { AppError } from "@/errors/index.tsx";

export class SessionExpiredError extends AppError {
  public statusCode = 401;
  public name = "You have been logged out";
  public message = "Session Expired";
}

export class InvalidApiUrlError extends AppError {
  public statusCode = 402;
  public name = "Invalid API URL";
}


export class SessionParseFailedError extends AppError {
  public name = "Unable to parse session data";

  constructor(message: string) {
    super();
    this.message = message;
  }
}
