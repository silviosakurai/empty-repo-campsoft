import { Type } from "@sinclair/typebox";

export const paymentBoletoSchema = Type.Union([
  Type.Object({
    url: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    code: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    expire_at: Type.Optional(Type.Union([Type.String(), Type.Null()])),
  }),
  Type.Null(),
]);
