import { injectable } from "tsyringe";
import { UpdateProductDetailHowToAccessRequest } from "@core/useCases/product/dtos/UpdateProductDetaiHowToAccessRequest.dto";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";
import { ProductService } from "@core/services";
import { TFunction } from "i18next";
import { ProductHowToAccessType } from "@core/common/enums/models/product";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";

@injectable()
export class ProductsDetailHowToAccessUpdaterUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async updateDetailsHowToAccess(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    input: {
      productId: string;
      request: UpdateProductDetailHowToAccessRequest;
    }
  ) {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    const productCompany = await this.productService.productCompanyViewer(
      input.productId,
      listPartnersIds
    );

    if (!productCompany) {
      return t("how_to_access_product_update_not_allowed");
    }

    const updateParams = this.buildUpdateParams(input.request);

    if (!updateParams) {
      return null;
    }

    return this.productService.updateDetailHowToAccess(
      input.productId,
      updateParams
    );
  }

  private buildUpdateParams(
    request: UpdateProductDetailHowToAccessRequest
  ): UpdateParams | null {
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
        return null;
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
