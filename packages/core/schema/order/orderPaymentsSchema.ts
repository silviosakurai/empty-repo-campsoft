import { Type } from "@sinclair/typebox";
import { paymentBoletoSchema } from "../payment/paymentBoletoSchema";
import { paymentPixSchema } from "../payment/paymentPixSchema";
import { paymentCreditCardOrderSchema } from "../payment/paymentCreditCardOrderSchema";

export const orderPaymentsSchema = Type.Object({
  type: Type.String(),
  status: Type.String(),
  credit_card: paymentCreditCardOrderSchema,
  voucher: Type.String(),
  boleto: paymentBoletoSchema,
  pix: paymentPixSchema,
  cycle: Type.Optional(Type.Number()),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
