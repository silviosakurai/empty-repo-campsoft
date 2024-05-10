import {
  marketingProductHighlightsListSchema,
  marketingProductInstitucionalListSchema,
} from "@core/schema/product/productViewSchema";
import { Static } from "@sinclair/typebox";

export type MarketingProductInstitucionalList = Static<
  typeof marketingProductInstitucionalListSchema
>;

export type MarketingProductHighlightsList = Static<
  typeof marketingProductHighlightsListSchema
>;
