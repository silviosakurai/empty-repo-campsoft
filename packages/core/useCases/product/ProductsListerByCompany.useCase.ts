import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductGroupedByCompanyResponse } from "./dtos/ListProductResponse.dto";

@injectable()
export class ProductsListerByCompanyUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    query: ListProductRequest
  ): Promise<ListProductGroupedByCompanyResponse | null> {
    return this.productService.listByCompanyIds(query);
  }
}
