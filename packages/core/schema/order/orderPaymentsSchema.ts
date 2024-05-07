import { Type } from "@sinclair/typebox";
import { paymentBoletoSchema } from "../payment/paymentBoletoSchema";
import { paymentPixSchema } from "../payment/paymentPixSchema";
import { paymentCreditCardOrderSchema } from "../payment/paymentCreditCardOrderSchema";

export const orderPaymentsSchema = Type.Object({
  type_id: Type.Union([Type.Number(), Type.Null()]),
  type: Type.String({ nullable: true }),
  status: Type.String({ nullable: true }),
  credit_card: paymentCreditCardOrderSchema,
  voucher: Type.Union([Type.String(), Type.Null()]),
  boleto: paymentBoletoSchema,
  pix: paymentPixSchema,
  cycle: Type.Union([Type.Number(), Type.Null()]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
