import { Type } from "@sinclair/typebox";
import { signatureActiveSchema } from "../signature/signatureActiveSchema";
import { cartCreateRequestSchema } from "./cartCreateRequestSchema";
import { planPriceSchema } from "../plan/planPriceSchema";
import { imagesProductSchema } from "../image/imagesProductSchema";

export const planViewerCartSchema = Type.Object({
  plan_id: Type.Number(),
  name: Type.Union([Type.String(), Type.Null()]),
  image: Type.Union([Type.String(), Type.Null()]),
  short_description: Type.Union([Type.String(), Type.Null()]),
});

export const productViewerCartSchema = Type.Object({
  product_id: Type.String(),
  name: Type.Union([Type.String(), Type.Null()]),
  short_description: Type.Union([Type.String(), Type.Null()]),
  images: imagesProductSchema,
});

export const cartListSchema = Type.Object({
  client_id: Type.String({ format: "uuid" }),
  cart_id: Type.String({ format: "uuid" }),
  total_prices: planPriceSchema,
  products_id: Type.Array(Type.String()),
  signature_active: Type.Array(signatureActiveSchema),
  payload: cartCreateRequestSchema,
});

export const cartListResponseSchema = Type.Object({
  ...cartListSchema.properties,
  plan: Type.Union([planViewerCartSchema, Type.Null()]),
  products: Type.Array(productViewerCartSchema),
});

export const cartListManagerResponseSchema = Type.Object({
  cart_id: Type.String({ format: "uuid" }),
  client_id: Type.String({ format: "uuid" }),
  partner_id: Type.Number(),
  payload: cartCreateRequestSchema,
  total_prices: planPriceSchema,
  products_id: Type.Array(Type.String()),
  signature_active: Type.Array(signatureActiveSchema),
});
