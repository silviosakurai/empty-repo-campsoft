import { injectable } from "tsyringe";
import { CrossSellProductRequest } from "./dtos/ListCrossSellProductRequest.dto";
import { ProductService } from "@core/services";
import { SignatureService } from "@core/services/signature.service";
import { ListProductResponse } from "./dtos/ListProductResponse.dto";
import { ProductResponse } from "./dtos/ProductResponse.dto";

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

    const recordsWithDiscounts: ProductResponse[] = records.results.map(
      (item) => this.generateDiscountValues(item)
    );

    if (!signatures)
      return {
        paging: records.paging,
        results: recordsWithDiscounts,
      };

    const recordsAvailable = recordsWithDiscounts.filter(
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

  private generateDiscountValues(item: ProductResponse) {
    const price = +item.prices.price;
    const price_with_discount = +item.prices.price_with_discount;

    return {
      ...item,
      prices: {
        ...item.prices,
        discount_percentage: +((price - price_with_discount) / price).toFixed(
          2
        ),
        discount_value: price - price_with_discount,
      },
    };
  }
}
