import { z } from "zod";

export const pingResponseSchema = z.strictObject({
  message: z.string(),
});

export type AuthResponse = z.infer<typeof pingResponseSchema>;
