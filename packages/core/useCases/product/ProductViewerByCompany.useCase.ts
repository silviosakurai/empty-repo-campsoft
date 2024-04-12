import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ProductResponse } from "./dtos/ProductResponse.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { AccessType } from "@core/common/enums/models/access";

@injectable()
export class ProductViewerByCompanyUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    sku: string,
  ): Promise<ProductResponse | null> {
    const companyIdsAllowed = this.companyIdsAllowed(tokenJwtData)

    return this.productService.viewByCompanyIds(companyIdsAllowed, sku);
  }

  private companyIdsAllowed = (tokenJwtData: ITokenJwtData) : number[] => 
    tokenJwtData.access.filter((a) => a.accessTypeId === AccessType.PRODUCT_MANAGEMENT).map((a) => a.companyId);
}
