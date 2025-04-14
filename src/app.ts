import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { api } from "./api";

export const app = new OpenAPIHono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api", api);

app.doc("/spec", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});
app.get("/swagger-ui", swaggerUI({ url: "/spec" }));
