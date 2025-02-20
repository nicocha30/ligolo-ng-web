import { HttpError } from "@/errors/index.tsx";

export class InvalidCredentialsError extends HttpError {
  public statusCode = 403;
  public name = "Invalid Credentials";
  public message = "Please check your login information";
}
