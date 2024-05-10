import {
  marketingProductHighlightsListSchema,
  marketingProductInstitucionalListSchema,
  marketingProductMagazinesListSchema,
  marketingProductSectionsListSchema,
} from "@core/schema/product/productViewSchema";
import { Static } from "@sinclair/typebox";

export type MarketingProductInstitucionalList = Static<
  typeof marketingProductInstitucionalListSchema
>;

export type MarketingProductHighlightsList = Static<
  typeof marketingProductHighlightsListSchema
>;

export type MarketingProductMagazinesList = Static<
  typeof marketingProductMagazinesListSchema
>;

export type MarketingProductSectionsList = Static<
  typeof marketingProductSectionsListSchema
>;
