import { injectable } from "tsyringe";
import { UpdateProductDetailHowToAccessRequest } from "@core/useCases/product/dtos/UpdateProductDetaiHowToAccessRequest.dto";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";
import { ProductService } from "@core/services";
import { TFunction } from "i18next";
import { ProductHowToAccessType } from "@core/common/enums/models/product";

@injectable()
export class ProductsDetailHowToAccessUpdaterUseCase {
  constructor(private readonly productService: ProductService) {}

  async updateDetailsHowToAccess(
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

    return this.productService.updateDetailHowToAccess(
      input.productId,
      updateParams
    );
  }
  private buildUpdateParams(
    request: UpdateProductDetailHowToAccessRequest
  ): UpdateParams {
    let como_acessar_mob: string | undefined = undefined;
    let como_acessar_url_and: string | undefined = undefined;
    let como_acessar_url_ios: string | undefined = undefined;
    let como_acessar_url: string | undefined = undefined;
    let como_acessar_desk: string | undefined = undefined;

    switch (request.type) {
      case ProductHowToAccessType.ANDROID:
        como_acessar_mob = request.content;
        como_acessar_url_and = request.url;
        break;
      case ProductHowToAccessType.IOS:
        como_acessar_mob = request.content;
        como_acessar_url_ios = request.url;
        break;
      case ProductHowToAccessType.WEB:
        como_acessar_url = request.url;
        como_acessar_desk = request.content;
        break;
      case ProductHowToAccessType.DESKTOP:
        como_acessar_url = request.url;
        como_acessar_desk = request.content;
        break;
      default:
        throw new Error("Tipo inválido");
    }
    const updateParams: UpdateParams = {};

    if (como_acessar_mob !== undefined) {
      updateParams.como_acessar_mob = como_acessar_mob;
    }
    if (como_acessar_url_and !== undefined) {
      updateParams.como_acessar_url_and = como_acessar_url_and;
    }
    if (como_acessar_url_ios !== undefined) {
      updateParams.como_acessar_url_ios = como_acessar_url_ios;
    }
    if (como_acessar_url !== undefined) {
      updateParams.como_acessar_url = como_acessar_url;
    }
    if (como_acessar_desk !== undefined) {
      updateParams.como_acessar_desk = como_acessar_desk;
    }
    return updateParams;
  }
}
