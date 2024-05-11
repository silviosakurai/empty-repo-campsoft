import { ProductService } from "@core/services/product.service";
import { injectable } from "tsyringe";

@injectable()
export class ProductFromGroupDeleterUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(groupId: number, productId: string): Promise<boolean | null> {
    const productGroupProduct =
      await this.productService.findProductGroupProduct(groupId, productId);

    if (!productGroupProduct) {
      return null;
    }

    return this.productService.deleteProductFromGroup(groupId, productId);
  }
}
