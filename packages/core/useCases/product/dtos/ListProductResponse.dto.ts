import { productListGroupedByCompanyResponseSchema } from "@core/schema/product/productListGroupedByCompanyResponseSchema";
import { ProductResponse } from "./ProductResponse.dto";
import { productListResponseSchema } from "@core/schema/product/productListResponseSchema";
import { productListWithPricesResponseSchema } from "@core/schema/product/productListWithPricesResponseSchema";
import { Static } from "@sinclair/typebox";
import { productDetailsWithPricesAndDatesGroupedByCompanySchema } from "@core/schema/product/productDetailsWithPricesAndDatesGroupedByCompany";
import { imagesProductSchema } from "@core/schema/image/imagesProductSchema";
import { productHowToAccess } from "@core/schema/product/productHowToAccess";
import { productTypeSchema } from "@core/schema/product/productTypeSchema";
import { pricesProductSchema } from "@core/schema/price/pricesProductSchema";
import { Status } from "@core/common/enums/Status";

export interface ListProductResult {
  results: ProductResponse[];
}

export type ListProductResponse = Static<typeof productListResponseSchema>;
export type ListProductGroupedByCompany = Static<
  typeof productDetailsWithPricesAndDatesGroupedByCompanySchema
>;
export type ListProductGroupedByCompanyResponse = Static<
  typeof productListGroupedByCompanyResponseSchema
>;
export type ListProductResponseCrossSell = Static<
  typeof productListWithPricesResponseSchema
>;

export interface ProductList {
  product_id: string;
  status: Status | null;
  name: string | null;
  long_description: string | null;
  short_description: string | null;
  marketing_phrases: string | null;
  content_provider_name: string | null;
  slug: string | null;
  images: Static<typeof imagesProductSchema>;
  how_to_access: Static<typeof productHowToAccess>;
  product_type: Static<typeof productTypeSchema>;
  prices: Static<typeof pricesProductSchema>;
  obs: string | null;
  created_at: string | null;
  updated_at: string | null;
}
