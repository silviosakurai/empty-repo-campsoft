import { injectable } from "tsyringe";
import { ProductService } from "@core/services";
import { CreateProductRequest } from "./dtos/CreateProductRequest.dto";

@injectable()
export class ProductsCreatorUseCase {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async execute(
    companyId: number,
    body: CreateProductRequest,
  ): Promise<boolean> {
    const productId = body.product_id;

    await this.productService.create(body);

    return this.productService.createProductPartner(productId, companyId);
  }
}
