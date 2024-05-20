import { injectable } from "tsyringe";
import { CrossSellProductRequest } from "./dtos/ListCrossSellProductRequest.dto";
import { SignatureService } from "@core/services/signature.service";
import { ListProductResponseCrossSell } from "./dtos/ListProductResponse.dto";
import { ProductResponseCrossSell } from "./dtos/ProductResponse.dto";
import { ProductService } from "@core/services/product.service";

@injectable()
export class CrossSellProductListerUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly signatureService: SignatureService
  ) {}

  async list(
    input: CrossSellProductRequest
  ): Promise<ListProductResponseCrossSell | null> {
    const records = await this.productService.listCrossSell(input);

    if (!records) {
      return this.emptyResult(input);
    }

    const signatures = await this.signatureService.findByClientId(
      input.client_id
    );

    const recordsWithDiscounts: ProductResponseCrossSell[] =
      records.results.map((item) => this.generateDiscountValues(item));

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

  private generateDiscountValues(item: ProductResponseCrossSell) {
    const price = Number(item.prices.price) || 0;
    const price_with_discount = Number(item.prices.price_with_discount) || 0;

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

  private emptyResult(input: CrossSellProductRequest) {
    return {
      paging: {
        total: 0,
        current_page: input.current_page,
        per_page: input.per_page,
        count: 0,
        total_pages: 0,
      },
      results: [],
    };
  }
}
