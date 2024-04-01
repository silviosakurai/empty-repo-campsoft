import { Type } from "@sinclair/typebox";
import { paymentBoletoSchema } from "../payment/paymentBoletoSchema";
import { paymentPixSchema } from "../payment/paymentPixSchema";
import { paymentCreditCardSchema } from "../payment/paymentCreditCardSchema";

export const orderPaymentsSchema = Type.Object({
  type: Type.String(),
  status: Type.String(),
  credit_card: paymentCreditCardSchema,
  voucher: Type.String(),
  boleto: paymentBoletoSchema,
  pix: paymentPixSchema,
  cycle: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
