import { injectable } from "tsyringe";
import { CreateProductRequest } from "./dtos/CreateProductRequest.dto";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductsCreatorUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    companyId: number,
    body: CreateProductRequest
  ): Promise<boolean> {
    const productId = body.product_id;

    await this.productService.create(body);

    return this.productService.createProductPartner(productId, companyId);
  }
}
