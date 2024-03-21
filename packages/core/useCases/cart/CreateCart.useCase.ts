import { Redis } from "ioredis";
import { CreateCartRequest } from "./dtos/CreateCartRequest.dto";
import { cacheEnvironment } from "@core/config/environments";
import { RedisKeys } from "@core/common/enums/RedisKeys";
import { PlanService, ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { CartOrder, CreateCartResponse } from "./dtos/CreateCartResponse.dto";
import { Plan } from "@core/common/enums/models/plan";

@injectable()
export class CreateCartUseCase {
  constructor(
    private planService: PlanService,
    private productService: ProductService
  ) {}

  async create(input: CreateCartRequest, companyId: number) {
    const plans = input.plans_id?.length
      ? await Promise.all(
          input.plans_id.map(
            (item) =>
              this.planService.viewPlan(companyId, item) as Promise<Plan>
          )
        )
      : [];

    const products = input.products_id?.length
      ? await this.productService.findProductsByIds(
          companyId,
          input.products_id
        )
      : [];

    const totals = plans.map((item) => this.generateOrder(item));

    const cart: CreateCartResponse = {
      id: uuidv4(),
      products,
      plans: plans,
      totals: [],
    };

    await this.saveValuesTemporary(cart);

    return cart;
  }

  private generateOrder(plan: Pick<Plan, "prices">): CartOrder[] {
    const record = plan.prices.map<CartOrder>((item) => ({
      subtotal_price: item.price ?? 0,
      discount_coupon_value: 0,
      discount_percentage: item.discount_percentage ?? 0,
      discount_item_value: item.discount_value ?? 0,
      discount_products_value: 0,
      installments: [],
      total: item.price ?? 0,
    }));

    return record;
  }

  private async saveValuesTemporary(cart: CreateCartResponse) {
    const redis = new Redis({
      host: cacheEnvironment.cacheHost,
      password: cacheEnvironment.cachePassword,
      port: cacheEnvironment.cachePort,
    });

    const fifteenMinutes = 15 * 60;

    await redis.set(
      `${RedisKeys.cart}:${cart.id}`,
      JSON.stringify(cart),
      "EX",
      fifteenMinutes
    );
  }
}
