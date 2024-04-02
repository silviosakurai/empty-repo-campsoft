import { Type } from "@sinclair/typebox";

export const pricesMonthSchema = Type.Object({
  months: Type.Union([Type.Number(), Type.Null()]),
  price: Type.Union([Type.Number(), Type.Null()]),
  discount_value: Type.Union([Type.Number(), Type.Null()]),
  discount_percentage: Type.Union([Type.Number(), Type.Null()]),
  price_with_discount: Type.Union([Type.Number(), Type.Null()]),
});
