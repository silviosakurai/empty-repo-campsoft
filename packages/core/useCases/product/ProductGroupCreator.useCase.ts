import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { ProductGroupNotFoundError } from "@core/common/exceptions/ProductGroupNotFoundError";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductGroupCreatorUseCase {
  constructor(private readonly productService: ProductService) {}

  async create(
    t: TFunction<"translation", undefined>,
    name: string,
    choices: number
  ) {
    const group = await this.productService.createProductGroup(name, choices);

    if (!group) {
      throw new ProductGroupNotFoundError(t("product_group_not_found"));
    }

    return true;
  }
}
