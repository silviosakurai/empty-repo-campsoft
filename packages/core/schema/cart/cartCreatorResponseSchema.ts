import { Type } from "@sinclair/typebox";
import { planPriceSchema } from "../plan/planPriceSchema";

export const cartCreatorResponseSchema = Type.Object({
  cart_id: Type.String({ format: "uuid" }),
  prices: planPriceSchema,
  products_id: Type.Array(Type.String()),
});
