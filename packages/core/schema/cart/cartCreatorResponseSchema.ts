import { planPriceSchema } from "@core/validations/plan/planPriceSchema";
import { Type } from "@sinclair/typebox";

export const cartCreatorResponseSchema = Type.Object({
  cart_id: Type.String({ format: "uuid" }),
  prices: planPriceSchema,
  products_id: Type.Array(Type.String()),
});
