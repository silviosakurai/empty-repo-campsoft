import { Type } from "@sinclair/typebox";

export const productGroupListSchema = Type.Object({
  product_group_id: Type.String(),
  name: Type.String(),
  choices: Type.Number(),
  products: Type.Array(Type.String()),
});
