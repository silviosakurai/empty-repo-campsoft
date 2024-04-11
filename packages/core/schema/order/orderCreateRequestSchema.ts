import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { Type } from "@sinclair/typebox";

export const orderPaymentSchema = Type.Object({
  type: Type.String({
    description: "Forma de pagamento",
    enum: Object.values(OrderPaymentsMethodsEnum),
  }),
  credit_card: Type.Union([
    Type.Object({
      name: Type.String(),
      number: Type.String(),
      expire_month: Type.Number(),
      expire_year: Type.Number(),
      cvv: Type.Number(),
      installments: Type.Number(),
    }),
    Type.Null(),
  ]),
  credit_card_id: Type.Union([Type.String(), Type.Null()]),
  voucher: Type.Union([Type.String(), Type.Null()]),
});

export const orderPlanSchema = Type.Object({
  plan_id: Type.Number(),
  selected_products: Type.Union([Type.Array(Type.String()), Type.Null()]),
});

export const orderCreateRequestSchema = Type.Object({
  previous_order_id: Type.Union([Type.String(), Type.Null()]),
  activate_now: Type.Boolean(),
  plan: orderPlanSchema,
  products: Type.Union([Type.Array(Type.String()), Type.Null()]),
  months: Type.Number(),
  subscribe: Type.Union([Type.Boolean(), Type.Null()]),
  coupon_code: Type.Union([Type.String(), Type.Null()]),
  payment: orderPaymentSchema,
});
