import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductGroupedByCompanyResponse } from "./dtos/ListProductResponse.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { AccessType } from "@core/common/enums/models/access";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";

@injectable()
export class ProductsListerByCompanyUseCase {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    query: ListProductRequest,
    companyIdsToFilter: number[],
  ): Promise<ListProductGroupedByCompanyResponse | null> {
    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT)

    let filteredCompanyIds = companyIdsAllowed

    if (companyIdsToFilter.length > 0) {
      filteredCompanyIds = 
        companyIdsAllowed.filter((companyId) => companyIdsToFilter.includes(companyId))
    }

    return this.productService.listByCompanyIds(filteredCompanyIds, query);
  }
}
