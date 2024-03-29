import { ProductVoucherStatus } from "@core/common/enums/models/product";
import { Type } from "@sinclair/typebox";
import { pricesSchema } from "../price/pricesSchema";
import { productsSelectedSchema } from "../product/productsSelectedSchema copy";
import { productDetailPlanProductsSchema } from "../product/productDetailPlanProductsSchema";

export const planDetailsWithProductsSelectedSchema = Type.Object({
  plan_id: Type.Number(),
  visible_site: Type.Boolean(),
  business_id: Type.Union([Type.Number(), Type.Null()]),
  plan: Type.Union([Type.String(), Type.Null()]),
  image: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  short_description: Type.Union([Type.String(), Type.Null()]),
  status: Type.Union([
    Type.String({ enum: Object.values(ProductVoucherStatus) }),
    Type.Null(),
  ]),
  prices: Type.Array(pricesSchema),
  plan_products: Type.Array(productDetailPlanProductsSchema),
  product_groups: Type.Array(productsSelectedSchema),
});
