import { Type } from "@sinclair/typebox";

export const cartListRequestSchema = Type.Object({
  cartId: Type.Optional(Type.String({ format: "uuid" })),
});
