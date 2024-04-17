import { injectable } from "tsyringe";
import { UpdateProductDetailHowToAccessRequest } from "@core/useCases/product/dtos/UpdateProductDetaiHowToAccessRequest.dto";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";
import { ProductService } from "@core/services";
import { TFunction } from "i18next";
import { ProductHowToAccessType } from "@core/common/enums/models/product";

@injectable()
export class ProductsDetailHowToAccessDeleterUseCase {
  constructor(private readonly productService: ProductService) {}

  async deleteDetailsHowToAccess(
    t: TFunction<"translation", undefined>,
    companyId: number,
    input: {
      productId: string;
      request: UpdateProductDetailHowToAccessRequest;
    }
  ) {
    const productCompany = await this.productService.productCompanyViewer(
      input.productId,
      companyId
    );

    const updateParams = this.buildUpdateParams(input.request);

    if (!updateParams) {
      return null;
    }

    return this.productService.deleteDetailHowToAccess(
      input.productId,
      updateParams
    );
  }

  private buildUpdateParams(
    request: UpdateProductDetailHowToAccessRequest
  ): UpdateParams | null {
    let como_acessar_mob: string | null = null;
    let como_acessar_url_and: string | null = null;
    let como_acessar_url_ios: string | null = null;
    let como_acessar_url: string | null = null;
    let como_acessar_desk: string | null = null;

    switch (request.type) {
      case ProductHowToAccessType.ANDROID:
        como_acessar_mob = "";
        como_acessar_url_and = "";
        break;
      case ProductHowToAccessType.IOS:
        como_acessar_mob = "";
        como_acessar_url_ios = "";
        break;
      case ProductHowToAccessType.WEB:
        como_acessar_url = "";
        como_acessar_desk = "";
        break;
      case ProductHowToAccessType.DESKTOP:
        como_acessar_url = "";
        como_acessar_desk = "";
        break;
      default:
        return null;
    }
    const updateParams: UpdateParams = {};

    if (como_acessar_mob === "") {
      updateParams.como_acessar_mob = como_acessar_mob;
    }
    if (como_acessar_url_and === "") {
      updateParams.como_acessar_url_and = como_acessar_url_and;
    }
    if (como_acessar_url_ios === "") {
      updateParams.como_acessar_url_ios = como_acessar_url_ios;
    }
    if (como_acessar_url === "") {
      updateParams.como_acessar_url = como_acessar_url;
    }
    if (como_acessar_desk === "") {
      updateParams.como_acessar_desk = como_acessar_desk;
    }
    return updateParams;
  }
}
