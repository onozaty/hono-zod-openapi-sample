import { z } from "@hono/zod-openapi";

const BaseErrorResponseSchema = z.object({
  message: z.string(),
  errors: z.array(z.string()).optional(),
});

export type ErrorResponse = z.infer<typeof BaseErrorResponseSchema>;

const createErrorResponseSchema = (name: string, example: ErrorResponse) =>
  BaseErrorResponseSchema.extend({}).openapi(name, { example });

export const errorResponses = {
  400: {
    description: "Bad Request",
    content: {
      "application/json": {
        schema: createErrorResponseSchema("ValidationErrorResponse", {
          message: "Validation Error",
          errors: ["name: Required"],
        }),
      },
    },
  },
  500: {
    description: "Internal Server Error",
    content: {
      "application/json": {
        schema: createErrorResponseSchema("UnknownErrorResponse", {
          message: "Unknown Error",
        }),
      },
    },
  },
};
