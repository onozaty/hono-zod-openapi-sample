import { createRoute, z } from "@hono/zod-openapi";
import { prisma } from "../../utils/db";
import { createApi } from "../base";

// -----------------------------------
// スキーマ定義
// -----------------------------------
const ProductSchema = z
  .object({
    productId: z.number().openapi({
      example: 123,
    }),
    name: z.string().openapi({
      example: "Car",
    }),
    description: z.string().nullable().optional().openapi({
      example: "xxxxxxx",
    }),
    price: z.number().openapi({
      example: 100000,
    }),
  })
  .openapi("Product");

const ProductListSchema = z.array(ProductSchema).openapi("Products");

const CreateProductSchema = z.object({
  name: z.string().openapi({
    example: "Car",
  }),
  description: z.string().nullable().openapi({
    example: "xxxxxxx",
  }),
  price: z.number().openapi({
    example: 100000,
  }),
});

// -----------------------------------
// ルート定義
// -----------------------------------
const productRoute = createApi();

// Product作成
productRoute.openapi(
  createRoute({
    method: "post",
    path: "products",
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateProductSchema,
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ProductSchema,
          },
        },
        description: "OK",
      },
    },
  }),
  async (c) => {
    const { name, description, price } = c.req.valid("json");

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });

    return c.json(product, 200);
  }
);

// Product一覧
productRoute.openapi(
  createRoute({
    method: "get",
    path: "products",
    request: {},
    responses: {
      200: {
        content: {
          "application/json": {
            schema: ProductListSchema,
          },
        },
        description: "OK",
      },
    },
  }),
  async (c) => {
    const products = await prisma.product.findMany();
    return c.json(products, 200);
  }
);

export { productRoute };
