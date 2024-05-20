import { ProductService } from "@core/services/product.service";
import { injectable } from "tsyringe";

@injectable()
export class ProductFromPartnerDeleterUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(partnerId: number, productId: string): Promise<boolean | null> {
    const productPartner = await this.productService.viewProductPartner(
      productId,
      partnerId
    );

    if (!productPartner) {
      return null;
    }

    return this.productService.deleteProductPartner(productId, partnerId);
  }
}
