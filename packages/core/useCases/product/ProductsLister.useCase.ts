import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductResponse } from "./dtos/ListProductResponse.dto";

@injectable()
export class ProductsListerUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    companyId: number,
    query: ListProductRequest
  ): Promise<ListProductResponse | null> {
    return this.productService.list(companyId, query);
  }
}
