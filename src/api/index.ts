import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { customerApi } from "./customer.js";

export const api = new OpenAPIHono();
api.route("/customers", customerApi);
api.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
  servers: [
    {
      url: "/api",
    },
  ],
});
api.get("/swagger-ui", swaggerUI({ url: "./doc" }));
