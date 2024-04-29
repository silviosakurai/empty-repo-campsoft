import { Type } from "@sinclair/typebox";

export const paymentCreditCardSchema = Type.Object({
  credit_card: Type.Optional(
    Type.Object({
      name: Type.String(),
      number: Type.String({ maxLength: 16 }),
      expire_month: Type.Number({ minimum: 1, maximum: 12 }),
      expire_year: Type.Number({
        minimum: new Date().getFullYear() % 100,
        maximum: 9999,
      }),
      cvv: Type.String({ maxLength: 4 }),
      installments: Type.Number({ minimum: 1 }),
    })
  ),
  credit_card_id: Type.Optional(Type.String()),
});
