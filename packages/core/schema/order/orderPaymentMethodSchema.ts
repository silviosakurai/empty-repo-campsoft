import { Type } from "@sinclair/typebox";

export const orderPaymentMethodSchema = Type.Object({
  type: Type.Union([Type.String(), Type.Null()]),
  code: Type.Union([Type.String(), Type.Null()]),
  brand: Type.Union([Type.String(), Type.Null()]),
});
