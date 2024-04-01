import { Type } from "@sinclair/typebox";

export const paymentBoletoSchema = Type.Object({
  url: Type.String(),
  code: Type.String(),
});
