import { ProductVoucherStatus } from "@core/common/enums/models/product";
import { Type } from "@sinclair/typebox";
import { productsAvailableSchema } from "../product/productsAvailableSchema";
import { productDetailPlanProductsWithHowToSchema } from "../product/productDetailPlanProductsWithHowToSchema";

export const planDetailsWithProductsSchema = Type.Object({
  plan_id: Type.Number(),
  visible_site: Type.Boolean(),
  business_id: Type.Number(),
  plan: Type.String(),
  image: Type.String(),
  description: Type.String(),
  short_description: Type.String(),
  status: Type.String({ enum: Object.values(ProductVoucherStatus) }),
  current_expiration: Type.String({ format: "date-time" }),
  expiration_date: Type.String({ format: "date-time" }),
  redemption_date: Type.String({ format: "date-time" }),
  plan_products: Type.Array(productDetailPlanProductsWithHowToSchema),
  product_groups: Type.Array(productsAvailableSchema),
});
