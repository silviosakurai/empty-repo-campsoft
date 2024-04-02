import { ProductResponse } from "@core/useCases/product/dtos/ProductResponse.dto";

export interface CancelOrderResponse {
  status: string;
  products: ProductResponse[];
}
