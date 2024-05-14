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
import { SignatureService } from "@core/services/signature.service";

@injectable()
export class ProductsListerUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly signatureService: SignatureService,
  ) {}

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

  async listLoggedNoPagination(
    clientId: string,
    query: ListAllProductRequest
  ): Promise<ProductListerNoPagination[] | null> {
    const signatures = await this.signatureService.findByClientId(clientId);

    if (!signatures) {
      return null;
    }

    const productIds = signatures.map((signature) => signature.product_id);

    return this.productService.listNoPaginationUserLogged(productIds, query);
  }
}
