import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductResponse } from "./dtos/ListProductResponse.dto";

@injectable()
export class ListProductUseCase {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async execute(
    companyId: number,
    query: ListProductRequest
  ): Promise<ListProductResponse | null> {
    return await this.productService.list(companyId, query);
  }
}
