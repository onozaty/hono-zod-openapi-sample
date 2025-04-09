import { createRoute, z } from "@hono/zod-openapi";
import { prisma } from "../../utils/db";
import { createApi } from "../base";
import { errorResponses } from "../error-schema";

// -----------------------------------
// スキーマ定義
// -----------------------------------
const CustomerSchema = z
  .object({
    customerId: z.number().openapi({
      example: 123,
    }),
    name: z.string().openapi({
      example: "Yamada Taro",
    }),
    email: z.string().email().openapi({
      example: "taro@example.com",
    }),
  })
  .openapi("Customer");

const CustomerListSchema = z.array(CustomerSchema).openapi("Customers");

const CreateCustomerSchema = z.object({
  name: z.string().openapi({
    example: "Yamada Taro",
  }),
  email: z.string().email().openapi({
    example: "taro@example.com",
  }),
});

// -----------------------------------
// ルート定義
// -----------------------------------
const customerRoute = createApi();

// Customer作成
customerRoute.openapi(
  createRoute({
    method: "post",
    path: "",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateCustomerSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: CustomerSchema,
          },
        },
        description: "OK",
      },
      ...errorResponses,
    },
  }),
  async (c) => {
    const { name, email } = c.req.valid("json");

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
      },
    });

    return c.json(customer, 200);
  }
);

// Customer一覧
customerRoute.openapi(
  createRoute({
    method: "get",
    path: "",
    request: {},
    responses: {
      200: {
        content: {
          "application/json": {
            schema: CustomerListSchema,
          },
        },
        description: "OK",
      },
    },
  }),
  async (c) => {
    const customers = await prisma.customer.findMany();
    return c.json(customers, 200);
  }
);

export { customerRoute };
