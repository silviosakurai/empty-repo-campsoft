import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ProductListerRepository } from "@core/repositories/product/ProductLister.repository";
import { ProductViewerRepository } from "@core/repositories/product/ProductViewer.repository";
import { CrossSellProductListerRepository } from "@core/repositories/product/CrossSellProductLister.repository";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ProductService {
  constructor(
    private readonly productListerRepository: ProductListerRepository,
    private readonly productViewerRepository: ProductViewerRepository,
    private readonly crossSellProductListerRepository: CrossSellProductListerRepository
  ) {}

  list = async (companyId: number, query: ListProductRequest) => {
    return this.productListerRepository.list(companyId, query);
  };

  listByIds = async (companyId: number, productIds: string[]) => {
    return this.productListerRepository.listByIds(companyId, productIds);
  };

  view = async (companyId: number, sku: string) => {
    return this.productViewerRepository.get(companyId, sku);
  };

  listCrossSell = async (input: CrossSellProductRequest) => {
    return this.crossSellProductListerRepository.list(input);
  };

  findPlanProductCrossSell = async (
    tokenKeyData: ITokenKeyData,
    planId: number,
    months: number,
    selectedProducts: string[]
  ) => {
    return this.crossSellProductListerRepository.findPlanProductCrossSell(
      tokenKeyData,
      planId,
      months,
      selectedProducts
    );
  };

  findPlanPriceProductCrossSell = async (
    tokenKeyData: ITokenKeyData,
    planId: number,
    months: number,
    selectedProducts: string[]
  ) => {
    return this.crossSellProductListerRepository.findPlanPriceProductCrossSell(
      tokenKeyData,
      planId,
      months,
      selectedProducts
    );
  };
}
