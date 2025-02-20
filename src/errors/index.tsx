import { addToast } from "@heroui/react";

export abstract class AppError extends Error {
  static fromError({ stack, name, message }: Error | unknown) {
    const error = new UnknownAppError();
    error.message = message;
    error.stack = stack;
    error.name = name;

    return error;
  }
  public toast() {
    return addToast({
      severity: "danger",
      color: "danger",
      title: `Error: ${this.name}`,
      description: this.message,
    });
  }
}

export abstract class HttpError extends AppError {
  public statusCode: number;

  static fromError(
    { stack, name, message }: Error | unknown,
    statusCode = 500,
  ) {
    const error = new UnknownHttpError();
    error.message = message;
    error.stack = stack;
    error.name = name;
    error.statusCode = statusCode;

    return error;
  }

  public toast() {
    return addToast({
      severity: "danger",
      color: "danger",
      title: `(${this.statusCode}) Error: ${this.name}`,
      description: this.message,
    });
  }
}

export class UnknownAppError extends AppError {
  public name = "Unknown Error";
  public message = "Something unexpected happened";
}
export class UnknownHttpError extends HttpError {
  public name = "Unknown API Error";
  public message = "API responded with an unexpected error";
}
