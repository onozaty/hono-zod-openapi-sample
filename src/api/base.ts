import { OpenAPIHono } from "@hono/zod-openapi";

export const createApi = () =>
  new OpenAPIHono({
    defaultHook: (result) => {
      if (result.success) {
        return;
      }
      const errors = result.error.errors.map(
        (issue) => `${issue.path.join(".")}: ${issue.message}`
      );
      throw new ValidationError(errors, result.error);
    },
  });

export class ValidationError extends Error {
  readonly name = "ValidationError";
  readonly errors: string[];

  constructor(errors: string[], cause?: unknown) {
    super("Validation Error", {
      cause: cause,
    });

    this.errors = errors;
  }
}
