import { IPaginationResponse } from "@core/common/interfaces/IPaginationResponse";
import { ProductResponse } from "./ProductResponse.dto";

export interface ListProductResult {
  results: ProductResponse[];
}

export type ListProductResponse = IPaginationResponse & ListProductResult;