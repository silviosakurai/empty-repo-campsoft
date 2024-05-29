import { Type } from "@sinclair/typebox";

export const paymentCreditCardOrderSchema = Type.Union([
  Type.Object({
    brand: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    number: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    credit_card_id: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  }),
  Type.Null(),
]);
