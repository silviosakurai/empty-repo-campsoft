import { Type } from "@sinclair/typebox";
import { productDetailPlanProductsSchema } from "./productDetailPlanProductsSchema";

export const productsAvailableSchema = Type.Object({
  product_group_id: Type.Number(),
  name: Type.Union([Type.String(), Type.Null()]),
  quantity: Type.Number(),
  available_products: Type.Array(productDetailPlanProductsSchema),
});
