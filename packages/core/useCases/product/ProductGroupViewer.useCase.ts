import { injectable } from "tsyringe";
import { ViewProductGroupResponse } from "./dtos/ViewProductGroupResponse.dto";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductGroupViewerUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(groupId: number): Promise<ViewProductGroupResponse | null> {
    const group = await this.productService.findGroup(groupId);

    if (!group) {
      return null;
    }

    const productGroupProducts =
      await this.productService.listProductGroupProduct(groupId);

    const productIds = productGroupProducts.map(
      (productGroupProduct) => productGroupProduct.productId
    );

    return {
      name: group.name,
      choices: group.quantity,
      products: productIds,
    };
  }
}
