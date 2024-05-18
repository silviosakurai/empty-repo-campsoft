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
  selected_products: Type.Optional(
    Type.Array(Type.String(), { nullable: true })
  ),
});

export const orderCreateRequestSchema = Type.Object({
  cart_id: Type.String({ format: "uuid" }),
  payment: orderPaymentSchema,
});
