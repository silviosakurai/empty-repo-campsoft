import { Type } from "@sinclair/typebox";

export const pricesSchema = Type.Object({
  price: Type.Number(),
  discount_value: Type.Number(),
  discount_percentage: Type.Number(),
  price_with_discount: Type.Number(),
});
