import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { AddProductToGroupBodyRequest } from "./dtos/AddProductToGroupRequest.dto";

@injectable()
export class AddProductsToGroupUseCase {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async execute(
    groupId: number,
    body: AddProductToGroupBodyRequest,
  ): Promise<boolean | null> {
    const group = await this.productService.findGroup(groupId);

    if (!group) {
      return null;
    }

    const productGroupsPromises = 
      body.product_id.map(productId => this.productService.addProductToGroup(groupId, productId));

    try {
      await Promise.all(productGroupsPromises);
      return true;
    } catch (error) {
      return false;
    }
  }
}
