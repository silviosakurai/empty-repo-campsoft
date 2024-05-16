import { Type } from "@sinclair/typebox";
import { orderTotalsSchema } from "./orderTotalsSchema";
import { paymentInstallmentsSchema } from "../payment/paymentInstallmentsSchema";
import { orderPaymentsSchema } from "./orderPaymentsSchema";
import { planDetailsWithProductsSelectedSchema } from "../plan/planDetailsWithProductsSelectedSchema";

export const orderListWithRecurrenceSchema = Type.Object({
  order_id: Type.String(),
  seller_id: Type.String({ nullable: true }),
  status: Type.String(),
  totals: orderTotalsSchema,
  installments: paymentInstallmentsSchema,
  payments: Type.Array(orderPaymentsSchema),
  plan: Type.Union([planDetailsWithProductsSelectedSchema, Type.Null()]),
  validity: Type.String({ format: "date-time" }),
  origin: Type.String(),
  recurrence: Type.String({ nullable: true }),
  price: Type.Union([Type.Number(), Type.Null()]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
