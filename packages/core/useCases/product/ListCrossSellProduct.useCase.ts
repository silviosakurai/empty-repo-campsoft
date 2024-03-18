import { injectable } from "tsyringe";
import { CrossSellProductRequest } from "./dtos/ListCrossSellProductRequest.dto";
import { ProductService } from "@core/services";

@injectable()
export class ListCrossSellProductUseCase {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async list(input: CrossSellProductRequest) {
    return await this.productService.listCrossSell(input);
  }
}
