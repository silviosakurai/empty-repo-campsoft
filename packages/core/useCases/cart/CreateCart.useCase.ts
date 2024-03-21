import { Redis } from "ioredis";
import { CreateCartRequest } from "./dtos/CreateCartRequest.dto";
import { cacheEnvironment } from "@core/config/environments";
import { RedisKeys } from "@core/common/enums/RedisKeys";
import { PlanService, ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class CreateCartUseCase {
  constructor(
    private planService: PlanService,
    private productService: ProductService
  ) {}

  async create(input: CreateCartRequest, companyId: number) {
    const redis = new Redis({
      host: cacheEnvironment.cacheHost,
      password: cacheEnvironment.cachePassword,
      port: cacheEnvironment.cachePort,
    });

    const plans = input.plans_id?.length
      ? await Promise.all(
          input.plans_id.map((item) =>
            this.planService.viewPlan(companyId, item)
          )
        )
      : [];

    const products = input.products_id?.length
      ? await this.productService.findProductsByIds(
          companyId,
          input.products_id
        )
      : [];

    const cart = {
      id: uuidv4(),
      products,
      plans,
    };

    const fifteenMinutes = 15 * 60;

    await redis.set(
      `${RedisKeys.cart}:${cart.id}`,
      JSON.stringify(cart),
      "EX",
      fifteenMinutes
    );

    return cart;
  }
}
