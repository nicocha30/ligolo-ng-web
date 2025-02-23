import { AppError } from "@/errors/index.tsx";

export class ValidationError extends AppError {
  public name = "Invalid Data";
  constructor(zodError: unknown) {
    super();
    console.error(zodError);
    // TODO parse zod response
  }
}
