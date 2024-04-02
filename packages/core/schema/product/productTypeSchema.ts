import { Type } from "@sinclair/typebox";

export const productTypeSchema = Type.Object({
  product_type_id: Type.Number(),
  product_type_name: Type.String(),
});
