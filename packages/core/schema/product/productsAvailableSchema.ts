import { Type } from "@sinclair/typebox";
import { productDetailSchema } from "./productDetailSchema";

export const productsAvailableSchema = Type.Object({
  product_group_id: Type.Number(),
  name: Type.String(),
  quantity: Type.Number(),
  available_products: Type.Array(productDetailSchema),
});
