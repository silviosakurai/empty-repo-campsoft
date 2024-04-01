import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ProductListerRepository } from "@core/repositories/product/ProductLister.repository";
import { ProductViewerRepository } from "@core/repositories/product/ProductViewer.repository";
import { CrossSellProductListerRepository } from "@core/repositories/product/CrossSellProductLister.repository";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";

@injectable()
export class ProductService {
  constructor(
    private readonly productListerRepository: ProductListerRepository,
    private readonly productViewerRepository: ProductViewerRepository,
    private readonly crossSellProductListerRepository: CrossSellProductListerRepository
  ) {}

  list = async (companyId: number, query: ListProductRequest) => {
    return await this.productListerRepository.list(companyId, query);
  };

  view = async (companyId: number, sku: string) => {
    return await this.productViewerRepository.get(companyId, sku);
  };

  listCrossSell = async (input: CrossSellProductRequest) => {
    return await this.crossSellProductListerRepository.list(input);
  };
}
