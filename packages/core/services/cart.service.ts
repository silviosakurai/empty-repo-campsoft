import { injectable } from "tsyringe";
import {
  CartDocument,
  CartDocumentResponse,
  ProductViewerCart,
} from "@core/interfaces/repositories/cart";
import { ProductService } from "./product.service";
import { PlanService } from "./plan.service";

@injectable()
export class CartService {
  constructor(
    private readonly planService: PlanService,
    private readonly productService: ProductService
  ) {}

  getCartWithInfo = async (
    cart: CartDocument
  ): Promise<CartDocumentResponse> => {
    const [plan, products] = await Promise.all([
      this.planService.viewCart(cart.payload.plan.plan_id),
      this.productService.listByIdsCart(cart.products_id),
    ]);

    const planResume = plan
      ? {
          ...plan,
          short_description:
            this.productNames(products) ?? plan.short_description,
        }
      : null;

    return {
      ...cart,
      plan: planResume,
      products,
    };
  };

  productNames = (products: ProductViewerCart[]): string => {
    const productNames = products
      .map((product) => product.name)
      .filter((name) => name !== null) as string[];

    return productNames.length > 1
      ? `${productNames.slice(0, -1).join(", ")} e ${productNames[productNames.length - 1]}.`
      : `${productNames[0]}.`;
  };
}
