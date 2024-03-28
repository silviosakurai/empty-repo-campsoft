import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductRepository } from "@core/repositories/product/ListProduct.repository";
import { ViewProductRepository } from "@core/repositories/product/ViewProduct.repository";
import { ListCrossSellProductRepository } from "@core/repositories/product/ListCrossSellProduct.repository";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";

@injectable()
export class ProductService {
  constructor(
    private readonly productListerRepository: ListProductRepository,
    private readonly productViewerRepository: ViewProductRepository,
    private readonly crossSellProductListerRepository: ListCrossSellProductRepository
  ) {}

  listProduct = async (companyId: number, query: ListProductRequest) => {
    try {
      return await this.productListerRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };

  viewProduct = async (companyId: number, sku: string) => {
    try {
      return await this.productViewerRepository.get(companyId, sku);
    } catch (error) {
      throw error;
    }
  };

  listCrossSell = async (input: CrossSellProductRequest) => {
    try {
      return await this.crossSellProductListerRepository.list(input);
    } catch (error) {
      throw error;
    }
  };
}
