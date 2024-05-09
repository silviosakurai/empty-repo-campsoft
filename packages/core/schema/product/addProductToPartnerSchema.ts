import { Type } from "@sinclair/typebox";

export const addProductToPartnerSchema = Type.Object({
  products: Type.Array(Type.String()),
});
