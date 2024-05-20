import { injectable } from "tsyringe";
import { UpdateProductRequest } from "./dtos/UpdateProductRequest.dto";
import { ProductUpdateNotAllowedError } from "@core/common/exceptions/ProductUpdateNotAllowedError";
import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductsUpdaterUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async update(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    input: {
      productId: string;
      request: UpdateProductRequest;
    }
  ) {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    const productCompany = await this.productService.productCompanyViewer(
      input.productId,
      listPartnersIds
    );

    if (!productCompany) {
      throw new ProductUpdateNotAllowedError(t("product_update_not_allowed"));
    }

    return this.productService.update(input.productId, input.request);
  }
}
