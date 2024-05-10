import { marketingProductInstitucionalListSchema } from "@core/schema/product/productViewSchema";
import { Static } from "@sinclair/typebox";

export type MarketingProductInstitucionalList = Static<
  typeof marketingProductInstitucionalListSchema
>;
