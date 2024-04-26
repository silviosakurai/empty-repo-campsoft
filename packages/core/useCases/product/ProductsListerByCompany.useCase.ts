import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductGroupedByCompanyResponse } from "./dtos/ListProductResponse.dto";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { ListProductByCompanyRequest } from "./dtos/ListProductByCompanyRequest.dto";

@injectable()
export class ProductsListerByCompanyUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    query: ListProductByCompanyRequest
  ): Promise<ListProductGroupedByCompanyResponse> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    const [listCompanies, total] = await Promise.all([
      this.productService.listByCompanyIds(query, listPartnersIds),
      this.productService.countTotalCompanies(query, listPartnersIds),
    ]);

    if (!listCompanies?.length) {
      return this.emptyResult(query);
    }

    const paging = setPaginationData(
      listCompanies.length,
      total,
      query.per_page,
      query.current_page
    );

    return {
      paging,
      results: listCompanies,
    };
  }

  private emptyResult(input: ListProductByCompanyRequest) {
    const paging = setPaginationData(0, 0, input.per_page, input.current_page);

    return {
      paging,
      results: [],
    };
  }
}
