import { Type } from "@sinclair/typebox";
import { signatureActiveSchema } from "../signature/signatureActiveSchema";
import { cartCreateRequestSchema } from "./cartCreateRequestSchema";
import { planPriceSchema } from "../plan/planPriceSchema";

export const cartListResponseSchema = Type.Object({
  cart_id: Type.String({ format: "uuid" }),
  payload: cartCreateRequestSchema,
  total_prices: planPriceSchema,
  products_id: Type.Array(Type.String()),
  signature_active: Type.Array(signatureActiveSchema),
});
