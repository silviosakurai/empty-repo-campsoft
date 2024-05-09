import { injectable } from "tsyringe";
import { ProductService } from "@core/services";
import { TFunction } from "i18next";
import { ProductGroupNotFoundError } from "@core/common/exceptions/ProductGroupNotFoundError";
import { ProductGroupImageType } from "@core/common/enums/models/product";

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
