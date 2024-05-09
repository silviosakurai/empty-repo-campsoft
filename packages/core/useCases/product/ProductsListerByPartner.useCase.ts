import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductGroupedByPartnerResponse } from "./dtos/ListProductResponse.dto";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { ListProductByCompanyRequest } from "./dtos/ListProductByCompanyRequest.dto";

@injectable()
export class ProductsListerByPartnerUseCase {
  constructor(
    private readonly productService: ProductService,
  ) {}

  async execute(
    partnerId: number,
    query: ListProductByCompanyRequest
  ): Promise<ListProductGroupedByPartnerResponse> {
    const [listCompanies, total] = await Promise.all([
      this.productService.listByCompanyIds(query, [partnerId]),
      this.productService.countTotalCompanies(query, [partnerId]),
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
