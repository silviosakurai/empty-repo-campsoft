import { Type } from "@sinclair/typebox";

export const orderPlanSchema = Type.Object({
  plan_id: Type.Number(),
  selected_products: Type.Optional(
    Type.Array(Type.String(), { nullable: true })
  ),
});

export const cartCreateRequestSchema = Type.Object({
  previous_order_id: Type.Optional(
    Type.Union([Type.String({ format: "uuid" }), Type.Null()])
  ),
  activate_now: Type.Optional(Type.Boolean()),
  plan: orderPlanSchema,
  products: Type.Optional(
    Type.Union([Type.Array(Type.String(), { nullable: true }), Type.Null()])
  ),
  months: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  subscribe: Type.Union([Type.Boolean(), Type.Null()]),
  coupon_code: Type.Optional(Type.Union([Type.String(), Type.Null()])),
});
