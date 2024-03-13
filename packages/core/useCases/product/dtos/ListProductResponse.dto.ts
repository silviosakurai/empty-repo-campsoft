import { ProductResponse } from "./ProductResponse.dto";

export interface ListProductResponse {
  paging: {
    current_page: number,
    total_pages: number,
    per_page: number,
    count: number,
    total: number,
  };
  results: ProductResponse[];
}
