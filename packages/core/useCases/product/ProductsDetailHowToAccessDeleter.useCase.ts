import { injectable } from "tsyringe";
import { UpdateProductDetailHowToAccessRequest } from "@core/useCases/product/dtos/UpdateProductDetaiHowToAccessRequest.dto";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";
import { ProductService } from "@core/services";
import { ProductHowToAccessType } from "@core/common/enums/models/product";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { TFunction } from "i18next";

@injectable()
export class ProductsDetailHowToAccessDeleterUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async deleteDetailsHowToAccess(
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
      return t("how_to_access_product_delete_not_allowed");
    }

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
    switch (request.type) {
      case ProductHowToAccessType.ANDROID:
        return this.createUpdateParamsForAndroid();
      case ProductHowToAccessType.IOS:
        return this.createUpdateParamsForIOS();
      case ProductHowToAccessType.WEB:
      case ProductHowToAccessType.DESKTOP:
        return this.createUpdateParamsForWebDesktop();
      default:
        return null;
    }
  }

  private createUpdateParamsForAndroid(): UpdateParams {
    return {
      como_acessar_mob: "",
      como_acessar_url_and: "",
    };
  }

  private createUpdateParamsForIOS(): UpdateParams {
    return {
      como_acessar_mob: "",
      como_acessar_url_ios: "",
    };
  }

  private createUpdateParamsForWebDesktop(): UpdateParams {
    return {
      como_acessar_url: "",
      como_acessar_desk: "",
    };
  }
}
