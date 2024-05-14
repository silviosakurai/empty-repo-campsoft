import { injectable } from "tsyringe";
import {
  ListAllProductRequest,
  ListProductRequest,
} from "@core/useCases/product/dtos/ListProductRequest.dto";
import {
  ListProductResponse,
  ProductListerNoPagination,
} from "./dtos/ListProductResponse.dto";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ProductsListerUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    companyId: number,
    query: ListProductRequest
  ): Promise<ListProductResponse | null> {
    return this.productService.list(companyId, query);
  }

  async listNoPagination(
    companyId: number,
    query: ListAllProductRequest
  ): Promise<ProductListerNoPagination[]> {
    return this.productService.listNoPagination(companyId, query);
  }
}
