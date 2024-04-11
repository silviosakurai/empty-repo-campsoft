import { productListGroupedByCompanyResponseSchema } from "@core/schema/product/productListGroupedByCompanyResponseSchema";
import { ProductResponse } from "./ProductResponse.dto";
import { productListResponseSchema } from "@core/schema/product/productListResponseSchema";
import { productListWithPricesResponseSchema } from "@core/schema/product/productListWithPricesResponseSchema";
import { Static } from "@sinclair/typebox";
import { productDetailsWithPricesAndDatesGroupedByCompanySchema } from "@core/schema/product/productDetailsWithPricesAndDatesGroupedByCompany";

export interface ListProductResult {
  results: ProductResponse[];
}

export type ListProductResponse = Static<typeof productListResponseSchema>;
export type ListProductGroupedByCompany = Static<typeof productDetailsWithPricesAndDatesGroupedByCompanySchema>;
export type ListProductGroupedByCompanyResponse = Static<typeof productListGroupedByCompanyResponseSchema>;
export type ListProductResponseCrossSell = Static<
  typeof productListWithPricesResponseSchema
>;
