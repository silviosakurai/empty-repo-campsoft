import { Type } from "@sinclair/typebox";
import { orderPaymentMethodSchema } from "./orderPaymentMethodSchema";

export const orderHistoricViewSchema = Type.Object({
  payment_order_id: Type.String(),
  date: Type.String(),
  method: orderPaymentMethodSchema,
  value: Type.String(),
  status: Type.String(),
});
