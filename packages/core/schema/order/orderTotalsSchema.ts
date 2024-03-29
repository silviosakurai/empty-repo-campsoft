import { Type } from "@sinclair/typebox";

export const orderTotalsSchema = Type.Object({
  subtotal_price: Type.Union([Type.Number(), Type.Null()]),
  discount_item_value: Type.Union([Type.Number(), Type.Null()]),
  discount_coupon_value: Type.Union([Type.Number(), Type.Null()]),
  discount_product_value: Type.Union([Type.Number(), Type.Null()]),
  discount_percentage: Type.Union([Type.Number(), Type.Null()]),
  total: Type.Union([Type.Number(), Type.Null()]),
});
