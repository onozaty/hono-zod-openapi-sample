import { z } from "@hono/zod-openapi";

export const ErrorResponseSchema = z
  .object({
    message: z.string(),
    errors: z.array(z.string()).optional(),
  })
  .openapi("ErrorResponseSchema");

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
