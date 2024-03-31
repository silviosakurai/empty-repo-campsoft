import { Type } from "@sinclair/typebox";
import { productsAvailableHowToAccessSchema } from "../product/productsAvailableHowToAccessSchema";
import { pricesMonthSchema } from "../price/pricesMonthSchema";
import { productDetailPlanProductsHowToAccessSchema } from "../product/productDetailPlanProductsHowToAccessSchema";

export const planDetailsWithProductsAvailableSchema = Type.Object({
  plan_id: Type.Number(),
  status: Type.Union([Type.String(), Type.Null()]),
  visible_site: Type.Boolean(),
  business_id: Type.Union([Type.Number(), Type.Null()]),
  plan: Type.Union([Type.String(), Type.Null()]),
  image: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  short_description: Type.Union([Type.String(), Type.Null()]),
  prices: Type.Array(pricesMonthSchema),
  products: Type.Array(productDetailPlanProductsHowToAccessSchema),
  product_groups: Type.Array(productsAvailableHowToAccessSchema),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
