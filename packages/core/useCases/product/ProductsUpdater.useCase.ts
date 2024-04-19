import { injectable } from "tsyringe";
import { UpdateProductRequest } from "./dtos/UpdateProductRequest.dto";
import { ProductService } from "@core/services";
import { ProductUpdateNotAllowedError } from "@core/common/exceptions/ProductUpdateNotAllowedError";
import { TFunction } from "i18next";

@injectable()
export class ProductsUpdaterUseCase {
  constructor(private readonly productService: ProductService) {}

  async update(
    t: TFunction<"translation", undefined>,
    companyId: number,
    input: {
      productId: string;
      request: UpdateProductRequest;
    }
  ) {
    const productCompany = await this.productService.productCompanyViewer(
      input.productId,
      companyId
    );

    if (!productCompany) {
      throw new ProductUpdateNotAllowedError(t("product_update_not_allowed"));
    }

    return this.productService.update(input.productId, input.request);
  }
}
