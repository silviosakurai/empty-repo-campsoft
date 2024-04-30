import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ProductResponse } from "./dtos/ProductResponse.dto";

@injectable()
export class ProductViewerByCompanyUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(sku: string): Promise<ProductResponse | null> {
    return this.productService.viewByCompanyIds(sku);
  }
}
