import { injectable } from "tsyringe";
import { CrossSellProductRequest } from "./dtos/ListCrossSellProductRequest.dto";
import { ProductService } from "@core/services";
import { SignatureService } from "@core/services/signature.service";
import { ListProductResponse } from "./dtos/ListProductResponse.dto";

@injectable()
export class ListCrossSellProductUseCase {
  constructor(
    private productService: ProductService,
    private signatureService: SignatureService
  ) {}

  async list(
    input: CrossSellProductRequest
  ): Promise<ListProductResponse | null> {
    const records = await this.productService.listCrossSell(input);

    if (!records) return null;

    const signatures = await this.signatureService.findByClientId(
      input.client_id
    );

    if (!signatures) return records;

    const recordsAvailable = records.results.filter(
      (record) =>
        !signatures.some(
          (signature) => signature.product_id === record.product_id
        )
    );

    return {
      paging: records.paging,
      results: recordsAvailable,
    };
  }
}
