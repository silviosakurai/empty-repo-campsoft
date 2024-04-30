import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { Type } from "@sinclair/typebox";
import { paymentCreditCardSchema } from "../payment/paymentCreditCardSchema";

export const orderPaymentSchema = Type.Object({
  type: Type.String({
    description: "Forma de pagamento",
    enum: Object.values(OrderPaymentsMethodsEnum),
  }),
  voucher: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  ...paymentCreditCardSchema.properties,
});

export const orderPlanSchema = Type.Object({
  plan_id: Type.Number(),
  selected_products: Type.Array(Type.String(), { nullable: true }),
});

export const orderCreateRequestSchema = Type.Object({
  previous_order_id: Type.Union([Type.String(), Type.Null()]),
  activate_now: Type.Boolean(),
  plan: orderPlanSchema,
  products: Type.Union([
    Type.Array(Type.String(), { nullable: true }),
    Type.Null(),
  ]),
  months: Type.Number(),
  subscribe: Type.Union([Type.Boolean(), Type.Null()]),
  coupon_code: Type.Union([Type.String(), Type.Null()]),
  payment: orderPaymentSchema,
});
