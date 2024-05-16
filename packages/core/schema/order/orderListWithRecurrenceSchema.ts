import { Type } from "@sinclair/typebox";
import { orderTotalsSchema } from "./orderTotalsSchema";
import { paymentInstallmentsSchema } from "../payment/paymentInstallmentsSchema";
import { orderPaymentsSchema } from "./orderPaymentsSchema";
import { planDetailsWithProductsSelectedSchema } from "../plan/planDetailsWithProductsSelectedSchema";

export const signatureSchema = Type.Object({
  status_id: Type.Number(),
  status: Type.String(),
  validity: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  origin: Type.Union([Type.String(), Type.Null()]),
  recurrence: Type.String({ nullable: false }),
});

export const orderListWithRecurrenceSchema = Type.Object({
  order_id: Type.String(),
  seller_id: Type.String({ nullable: true }),
  status: Type.String(),
  signature: signatureSchema,
  totals: orderTotalsSchema,
  installments: paymentInstallmentsSchema,
  payments: Type.Array(orderPaymentsSchema),
  plan: Type.Union([planDetailsWithProductsSelectedSchema, Type.Null()]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
