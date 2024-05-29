import { Type } from "@sinclair/typebox";

export const paymentInstallmentsSchema = Type.Object({
  installment: Type.Union([Type.Number(), Type.Null()]),
  value: Type.Union([Type.Number(), Type.Null()]),
});
