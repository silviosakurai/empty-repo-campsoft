import { injectable } from "tsyringe";
import { TFunction } from "i18next";
import OpenSearchService from "@core/services/openSearch.service";
import {
  CartDocumentResponse,
  ProductViewerCart,
} from "@core/interfaces/repositories/cart";
import { PlanService } from "@core/services/plan.service";
import { ProductService } from "@core/services/product.service";

@injectable()
export class ListerCartUseCase {
  constructor(
    private readonly openSearchService: OpenSearchService,
    private readonly planService: PlanService,
    private readonly productService: ProductService
  ) {}

  async getCart(
    t: TFunction<"translation", undefined>,
    cartId: string
  ): Promise<CartDocumentResponse> {
    const getCart = await this.openSearchService.getCart(cartId);

    if (!getCart) {
      throw new Error(t("cart_not_found"));
    }

    const [plan, products] = await Promise.all([
      this.planService.viewCart(getCart.payload.plan.plan_id),
      this.productService.listByIdsCart(getCart.products_id),
    ]);

    const planResume = plan
      ? {
          ...plan,
          short_description:
            this.productNames(products) ?? plan.short_description,
        }
      : null;

    return {
      ...getCart,
      plan: planResume,
      products,
    };
  }

  productNames(products: ProductViewerCart[]): string {
    const productNames = products
      .map((product) => product.name)
      .filter((name) => name !== null) as string[];

    return productNames.length > 1
      ? `${productNames.slice(0, -1).join(", ")} e ${productNames[productNames.length - 1]}.`
      : `${productNames[0]}.`;
  }
}
