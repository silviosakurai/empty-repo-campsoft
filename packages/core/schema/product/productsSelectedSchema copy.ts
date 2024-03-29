import { Type } from "@sinclair/typebox";
import { productDetailPlanProductsSchema } from "./productDetailPlanProductsSchema";

export const productsSelectedSchema = Type.Object({
  product_group_id: Type.Number(),
  name: Type.String(),
  quantity: Type.Number(),
  selected_products: Type.Array(productDetailPlanProductsSchema),
});
