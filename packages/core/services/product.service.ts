import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductRepository } from "@core/repositories/product/ListProduct.repository";
import { ViewProductRepository } from "@core/repositories/product/ViewProduct.repository";

@injectable()
export class ProductService {
  private listProductRepository: ListProductRepository;
  private viewProductRepository: ViewProductRepository;

  constructor(
    listProductRepository: ListProductRepository,
    viewProductRepository: ViewProductRepository
  ) {
    this.listProductRepository = listProductRepository;
    this.viewProductRepository = viewProductRepository;
  }

  listProduct = async (companyId: number, query: ListProductRequest) => {
    try {
      return await this.listProductRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };

  viewProduct = async (companyId: number, sku: string) => {
    try {
      return await this.viewProductRepository.get(companyId, sku);
    } catch (error) {
      throw error;
    }
  };

  findProductsByIds = async (companyId: number, productIds: string[]) => {
    try {
      return await this.listProductRepository.listByIds(companyId, productIds);
    } catch (error) {
      throw error;
    }
  };
}
