import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductGroupListerUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData
  ) {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    if (!listPartnersIds) {
      return Error(t("product_group_products_list_not_allowed"));
    }

    const productGroupProducts = await this.productService.listProductGroup();

    return productGroupProducts;
  }
}
