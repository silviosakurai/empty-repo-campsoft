import { Type } from "@sinclair/typebox";
import { productDetailSchema } from "../product/productDetailSchema";
import { planDetailsWithProductsSchema } from "../plan/planDetailsWithProductsSchema";

export const userVoucherResponseSchema = Type.Object({
  products: Type.Array(productDetailSchema),
  plan: planDetailsWithProductsSchema,
});
