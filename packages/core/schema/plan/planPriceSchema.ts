import { Type } from "@sinclair/typebox";

export const planPriceSchema = Type.Object({
  months: Type.Number(),
  price: Type.Union([Type.Number(), Type.Null()]),
  discount_value: Type.Union([Type.Number(), Type.Null()]),
  discount_percentage: Type.Union([Type.Number(), Type.Null()]),
  price_with_discount: Type.Union([Type.Number(), Type.Null()]),
  price_with_discount_order_previous: Type.Optional(
    Type.Union([Type.Number(), Type.Null()])
  ),
  discount_coupon: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  discount_product: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
});
