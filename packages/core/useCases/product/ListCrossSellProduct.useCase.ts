import { injectable } from "tsyringe";
import { CrossSellProductRequest } from "./dtos/ListCrossSellProductRequest.dto";
import { ProductService } from "@core/services";
import { SignatureService } from "@core/services/signature.service";

@injectable()
export class ListCrossSellProductUseCase {
  constructor(
    private productService: ProductService,
    private signatureService: SignatureService
  ) {}

  async list(input: CrossSellProductRequest) {
    const records = await this.productService.listCrossSell(input);

    if (!records) return null;

    const signatures = await this.signatureService.findByClientId(
      input.client_id
    );

    const recordsAvailable = records.results.reduce((prev, crr) => {}, []);

    return records;
  }
}
