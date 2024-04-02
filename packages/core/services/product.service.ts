import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductRepository } from "@core/repositories/product/ListProduct.repository";
import { ViewProductRepository } from "@core/repositories/product/ViewProduct.repository";
import { ListCrossSellProductRepository } from "@core/repositories/product/ListCrossSellProduct.repository";
import { CrossSellProductRequest } from "@core/useCases/product/dtos/ListCrossSellProductRequest.dto";

@injectable()
export class ProductService {
  private listProductRepository: ListProductRepository;
  private viewProductRepository: ViewProductRepository;
  private listCrossSellProductRepository: ListCrossSellProductRepository;

  constructor(
    listProductRepository: ListProductRepository,
    viewProductRepository: ViewProductRepository,
    listCrossSellProductRepository: ListCrossSellProductRepository
  ) {
    this.listProductRepository = listProductRepository;
    this.viewProductRepository = viewProductRepository;
    this.listCrossSellProductRepository = listCrossSellProductRepository;
  }

  listProduct = async (companyId: number, query: ListProductRequest) => {
    try {
      return this.listProductRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };

  listProductsByIds = async (companyId: number, productIds: string[]) => {
    try {
      return this.listProductRepository.listByIds(companyId, productIds);
    } catch (error) {
      throw error;
    }
  };

  viewProduct = async (companyId: number, sku: string) => {
    try {
      return this.viewProductRepository.get(companyId, sku);
    } catch (error) {
      throw error;
    }
  };

  listCrossSell = async (input: CrossSellProductRequest) => {
    try {
      return this.listCrossSellProductRepository.list(input);
    } catch (error) {
      throw error;
    }
  };
}
