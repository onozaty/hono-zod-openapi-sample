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

const CustomerIdParamSchema = z.object({
  id: z.coerce.number().openapi({
    example: 123,
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
    path: "customers",
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
    path: "customers",
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

// Customer情報
customerRoute.openapi(
  createRoute({
    method: "get",
    path: "customers/{id}",
    request: {
      params: CustomerIdParamSchema,
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
      404: {
        description: "Not Found",
      },
    },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const customer = await prisma.customer.findUnique({
      where: { customerId: id },
    });

    if (!customer) {
      return c.notFound();
    }
    return c.json(customer, 200);
  }
);

export { customerRoute };
