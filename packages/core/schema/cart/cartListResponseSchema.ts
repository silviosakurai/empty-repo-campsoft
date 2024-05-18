import { cartCreateRequestSchema } from "@core/validations/cart";
import { planPriceSchema } from "@core/validations/plan/planPriceSchema";
import { Type } from "@sinclair/typebox";
import { signatureActiveSchema } from "../signature/signatureActiveSchema";

export const cartListResponseSchema = Type.Object({
  cart_id: Type.String({ format: "uuid" }),
  payload: cartCreateRequestSchema,
  total_prices: planPriceSchema,
  products_id: Type.Array(Type.String()),
  signature_active: Type.Array(signatureActiveSchema),
});
