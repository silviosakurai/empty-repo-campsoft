import { injectable } from "tsyringe";
import { ProductService } from "@core/services";
import { UpdateProductGroupBodyRequest } from "./dtos/UpdateProductGroupRequest.dto";
import { TFunction } from "i18next";
import { ProductGroupUpdateNotAllowedError } from "@core/common/exceptions/ProductGroupUpdateNotAllowedError";

@injectable()
export class ProductsGroupUpdaterUseCase {
  constructor(private readonly productService: ProductService) {}

  async update(
    t: TFunction<"translation", undefined>,
    groupId: number,
    input: UpdateProductGroupBodyRequest,
  ) {
    const group = await this.productService.findGroup(
      groupId
    );

    if (!group) {
      throw new ProductGroupUpdateNotAllowedError(t("product_group_update_not_allowed"));
    }

    return this.productService.updateGroup(groupId, input);
  }
}
