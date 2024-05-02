import { Type } from "@sinclair/typebox";

export const userCreditCardRequestSchema = Type.Object({
  holder_name: Type.String(),
  expiration_month: Type.Number({ minimum: 1, maximum: 12 }),
  expiration_year: Type.Number({
    minimum: new Date().getFullYear() % 100,
    maximum: 9999,
  }),
  card_number: Type.String({ maxLength: 16 }),
  security_code: Type.String({ maxLength: 4 }),
  default: Type.Optional(Type.Boolean()),
});
