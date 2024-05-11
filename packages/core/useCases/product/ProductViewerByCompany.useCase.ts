import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ProductResponse } from "./dtos/ProductResponse.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ControlAccessService } from "@core/services/controlAccess.service";

@injectable()
export class ProductViewerByCompanyUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly controlAccessService: ControlAccessService,
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    sku: string,
  ): Promise<ProductResponse | null> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    return this.productService.viewByCompanyIds(listPartnersIds, sku);
  }
}
