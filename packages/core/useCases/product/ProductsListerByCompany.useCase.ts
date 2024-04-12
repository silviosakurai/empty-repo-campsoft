import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductGroupedByCompanyResponse } from "./dtos/ListProductResponse.dto";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { AccessType } from "@core/common/enums/models/access";

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
    const companyIdsAllowed = this.companyIdsAllowed(tokenJwtData)

    let filteredCompanyIds = companyIdsAllowed

    if (companyIdsToFilter.length > 0) {
      filteredCompanyIds = 
        companyIdsAllowed.filter((companyId) => companyIdsToFilter.includes(companyId))
    }

    return this.productService.listByCompanyIds(filteredCompanyIds, query);
  }

  private companyIdsAllowed = (tokenJwtData: ITokenJwtData) : number[] => 
      tokenJwtData.access.filter((a) => a.accessTypeId === AccessType.PRODUCT_MANAGEMENT).map((a) => a.companyId);
}
