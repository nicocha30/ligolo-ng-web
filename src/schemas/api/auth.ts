import { z } from "zod";

export const authResponseSchema = z.strictObject({
  token: z.string().optional(),
  error: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
