import { PlanService, ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { ProductViewResponse } from "./dtos/ProductResponse.dto";
import { ListPlanProductResponse } from "../plan/dtos/ListPlanResponse.dto";
import { MarketingService } from "@core/services/marketing.service";

@injectable()
export class ProductViewerUseCase {
  constructor(
    private readonly productService: ProductService,
    private readonly planService: PlanService,
    private readonly marketingService: MarketingService
  ) {}

  async execute(
    companyId: number,
    slug: string
  ): Promise<ProductViewResponse | null> {
    const product = await this.productService.view(companyId, slug);

    if (!product) {
      return null;
    }

    const [plansProduct, institutional, highlights] = await Promise.all([
      this.listPlansByProduct(companyId, product.product_id),
      this.marketingService.list(product.product_id),
      this.marketingService.listHighlights(product.product_id),
    ]);

    return {
      ...product,
      plans: plansProduct,
      institutional,
      highlights,
    };
  }

  async listPlansByProduct(companyId: number, productId: string) {
    const plansProduct = await this.planService.listPlansByProduct(
      companyId,
      productId
    );

    const planNames = plansProduct.map((plan) => plan.name);

    const formattedPlanNames =
      planNames.length > 1
        ? `${planNames.slice(0, -1).join(", ")} e ${planNames[planNames.length - 1]}.`
        : `${planNames[0]}.`;

    const lowestPrice = plansProduct.reduce((min, plan) => {
      return plan.low_price < min ? plan.low_price : min;
    }, Number.MAX_VALUE);

    return {
      plans_name: formattedPlanNames,
      low_price: lowestPrice,
    } as ListPlanProductResponse;
  }
}
