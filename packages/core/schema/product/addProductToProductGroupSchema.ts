import { Type } from "@sinclair/typebox";

export const addProductToProductGroupSchema = Type.Object({
  product_id: Type.Array(Type.String()),
});
