import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductResponse } from "./dtos/ListProductResponse.dto";
import { CompanyService } from "@core/services/company.service";

@injectable()
export class ProductsListerByCompanyUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly companyService: CompanyService,
  ) {}

  async execute(
    clientId: string,
    query: ListProductRequest,
    companyIdsToFilter: number[],
  ): Promise<ListProductResponse | null> {
    const companyIds = await this.companyService.list(clientId);

    if (!companyIds) {
      return null;
    }

    let filteredCompanyIds = companyIds;

    if (companyIdsToFilter.length > 0) {
      filteredCompanyIds = 
        companyIds.filter((companyId) => companyIdsToFilter.includes(companyId))
    }

    return this.productService.listByCompanyIds(filteredCompanyIds, query);
  }
}
