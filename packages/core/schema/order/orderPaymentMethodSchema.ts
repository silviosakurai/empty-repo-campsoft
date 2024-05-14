import { Type } from "@sinclair/typebox";

export const orderPaymentMethodSchema = Type.Object({
  type: Type.String(),
  code: Type.String(),
  brand: Type.String(),
});
