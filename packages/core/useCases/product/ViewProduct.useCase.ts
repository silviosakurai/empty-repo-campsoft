import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ProductResponse } from "./dtos/ProductResponse.dto";

@injectable()
export class ViewProductUseCase {
  private productService: ProductService;

  constructor(productService: ProductService) {
    this.productService = productService;
  }

  async execute(companyId: number, sku: string): Promise<ProductResponse | null> {
    return await this.productService.viewProduct(companyId, sku);
  }
}
