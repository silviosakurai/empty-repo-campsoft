import { injectable } from "tsyringe";
import { UpdateParams } from "@core/useCases/product/dtos/ProductDetaiHowToAccess.dto";
import { ProductService } from "@core/services";
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
    }
  ) {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    const productCompany = await this.productService.productCompanyViewer(
      input.productId,
      listPartnersIds
    );

    if (!productCompany) {
      return Error(t("how_to_access_product_delete_not_allowed"));
    }

    const updateParams = this.buildUpdateParams();

    if (!updateParams) {
      return null;
    }

    return this.productService.deleteDetailHowToAccess(
      input.productId,
      updateParams
    );
  }

  private buildUpdateParams(): UpdateParams | null {
    return this.createUpdateParams();
  }

  private createUpdateParams(): UpdateParams {
    return {
      como_acessar_mob: "",
      como_acessar_url_and: "",
      como_acessar_url_ios: "",
      como_acessar_desk: "",
      como_acessar_url: "",
    };
  }
}
