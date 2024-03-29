import { Type } from "@sinclair/typebox";

export const paymentCreditCardSchema = Type.Object({
  brand: Type.String(),
  number: Type.String(),
  credit_card_id: Type.String(),
});
