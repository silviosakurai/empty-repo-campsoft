import { ProductResponse } from "./ProductResponse.dto";
import { productListResponseSchema } from "@core/schema/product/productListResponseSchema";
import { productListWithPricesResponseSchema } from "@core/schema/product/productListWithPricesResponseSchema";
import { Static } from "@sinclair/typebox";

export interface ListProductResult {
  results: ProductResponse[];
}

export type ListProductResponse = Static<typeof productListResponseSchema>;
export type ListProductResponseCrossSell = Static<
  typeof productListWithPricesResponseSchema
>;
