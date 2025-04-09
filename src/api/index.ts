import type { ContentfulStatusCode } from "hono/utils/http-status";
import { createApi, ValidationError } from "./base";
import type { ErrorResponse } from "./error-schema";
import { customerRoute } from "./routes/customer";
import { productRoute } from "./routes/product";

const api = createApi()
  // 各ルートをマウント
  .route("/", customerRoute)
  .route("/", productRoute);

api.onError((error, c) => {
  const res = handleError(error);
  return c.json(res.body, res.status);
});

const handleError = (
  error: unknown
): { status: ContentfulStatusCode; body: ErrorResponse } => {
  console.error(error);

  if (error instanceof ValidationError) {
    return {
      status: 400,
      body: {
        message: "Validation Error",
        errors: error.errors,
      },
    };
  }

  return {
    status: 500,
    body: {
      message: "Unknown Error",
    },
  };
};

export { api };
