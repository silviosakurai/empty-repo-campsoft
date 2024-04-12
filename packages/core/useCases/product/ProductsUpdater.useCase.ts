import { injectable } from "tsyringe";
import { UpdateProductRequest } from "./dtos/UpdateProductRequest.dto";
import { ProductService } from "@core/services";

@injectable()
export class ProductsUpdaterUseCase {
  constructor(private readonly productService: ProductService) {}

  async update(productId: string, input: UpdateProductRequest) {
    return this.productService.update(productId, input);
  }
}
