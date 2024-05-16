import { Type } from "@sinclair/typebox";
import { orderTotalsSchema } from "./orderTotalsSchema";
import { paymentInstallmentsSchema } from "../payment/paymentInstallmentsSchema";
import { orderPaymentsSchema } from "./orderPaymentsSchema";
import { planDetailsWithProductsSelectedSchema } from "../plan/planDetailsWithProductsSelectedSchema";

const client = Type.Object({
  client_id: Type.String(),
  client_name: Type.String(),
});

const seller = Type.Object({
  seller_id: Type.String(),
  seller_name: Type.String(),
});

export const orderListByManagerSchema = Type.Object({
  order_id: Type.String(),
  client: client,
  seller: seller,
  status: Type.String(),
  totals: orderTotalsSchema,
  installments: paymentInstallmentsSchema,
  payments: Type.Array(orderPaymentsSchema),
  plan: Type.Union([planDetailsWithProductsSelectedSchema, Type.Null()]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
