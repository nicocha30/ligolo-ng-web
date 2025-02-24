import { AppError } from "@/errors/index.tsx";

export class ValidationError extends AppError {
  public name = "Invalid Data";
  public zodError: unknown;

  constructor(zodError: unknown) {
    super();
    this.stack = zodError.stack;
    this.zodError = zodError;
    console.error(zodError);
    // TODO parse zod response
  }
}
