import { injectable } from "tsyringe";
import { UpdateProductDetailHowToAccessRequest } from "@core/useCases/product/dtos/UpdateProductDetaiHowToAccessRequest.dto";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";
import { TFunction } from "i18next";
import { ProductHowToAccessType } from "@core/common/enums/models/product";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ProductService } from "@core/services/product.service";

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
      return Error(t("how_to_access_product_update_not_allowed"));
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
    switch (request.type) {
      case ProductHowToAccessType.ANDROID:
        return this.createUpdateParamsForAndroid(request);
      case ProductHowToAccessType.IOS:
        return this.createUpdateParamsForIOS(request);
      case ProductHowToAccessType.WEB:
      case ProductHowToAccessType.DESKTOP:
        return this.createUpdateParamsForWebDesktop(request);
      default:
        return null;
    }
  }

  private createUpdateParamsForAndroid(
    request: UpdateProductDetailHowToAccessRequest
  ): UpdateParams {
    return {
      como_acessar_mob: request.content,
      como_acessar_url_and: request.url,
    };
  }

  private createUpdateParamsForIOS(
    request: UpdateProductDetailHowToAccessRequest
  ): UpdateParams {
    return {
      como_acessar_mob: request.content,
      como_acessar_url_ios: request.url,
    };
  }

  private createUpdateParamsForWebDesktop(
    request: UpdateProductDetailHowToAccessRequest
  ): UpdateParams {
    return {
      como_acessar_url: request.content,
      como_acessar_desk: request.url,
    };
  }
}
