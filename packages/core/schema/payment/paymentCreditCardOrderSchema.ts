import { Type } from "@sinclair/typebox";

export const paymentCreditCardOrderSchema = Type.Union([
  Type.Object({
    brand: Type.Union([Type.String(), Type.Null()]),
    number: Type.Union([Type.String(), Type.Null()]),
    credit_card_id: Type.Union([Type.String(), Type.Null()]),
  }),
  Type.Null(),
]);
