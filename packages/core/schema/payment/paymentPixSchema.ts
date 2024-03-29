import { Type } from "@sinclair/typebox";

export const paymentPixSchema = Type.Object({
  url: Type.String(),
  code: Type.String(),
  expire_at: Type.String(),
});
