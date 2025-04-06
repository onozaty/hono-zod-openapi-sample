import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { prisma } from "../db.js";

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

const CustomerListSchema = z
  .array(CustomerSchema)
  .openapi("CustomerListSchema");

const CreateCustomerSchema = z
  .object({
    name: z.string().openapi({
      example: "Yamada Taro",
    }),
    email: z.string().email().openapi({
      example: "taro@example.com",
    }),
  })
  .openapi("CreateCustomer");

// -----------------------------------
// ルート定義
// -----------------------------------
const createCustomerRoute = createRoute({
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
  },
});

const getCustomersRoute = createRoute({
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
});

// -----------------------------------
// API定義
// -----------------------------------
export const customerApi = new OpenAPIHono();
customerApi.openapi(getCustomersRoute, async (c) => {
  const customers = await prisma.customer.findMany();
  return c.json(customers);
});
customerApi.openapi(createCustomerRoute, async (c) => {
  const { name, email } = c.req.valid("json");

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
    },
  });

  return c.json(customer);
});
