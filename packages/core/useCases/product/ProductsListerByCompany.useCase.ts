import { ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductGroupedByCompanyResponse } from "./dtos/ListProductResponse.dto";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class ProductsListerByCompanyUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly controlAccessService: ControlAccessService
  ) {}

  async execute(
    tokenJwtData: ITokenJwtData,
    query: ListProductRequest
  ): Promise<ListProductGroupedByCompanyResponse | null> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    return this.productService.listByCompanyIds(query, listPartnersIds);
  }
}
