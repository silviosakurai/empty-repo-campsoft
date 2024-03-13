import { injectable } from "tsyringe";
import { ListProductRequest } from "@core/useCases/product/dtos/ListProductRequest.dto";
import { ListProductRepository } from "@core/repositories/product/ListProduct.repository";

@injectable()
export class ProductService {
  private listProductRepository: ListProductRepository;

  constructor(
    listProductRepository: ListProductRepository,
  ) {
    this.listProductRepository = listProductRepository;
  }

  listProduct = async (companyId: number, query: ListProductRequest) => {
    try {
      return await this.listProductRepository.list(companyId, query);
    } catch (error) {
      throw error;
    }
  };
}
