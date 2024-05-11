import { injectable } from "tsyringe";
import { ProductResponse } from "./dtos/ProductResponse.dto";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductViewerUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    companyId: number,
    sku: string
  ): Promise<ProductResponse | null> {
    return this.productService.view(companyId, sku);
  }
}
