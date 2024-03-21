import { Redis } from "ioredis";
import { CreateCartRequest } from "./dtos/CreateCartRequest.dto";
import { cacheEnvironment } from "@core/config/environments";
import { RedisKeys } from "@core/common/enums/RedisKeys";
import { PlanService } from "@core/services";
import { injectable } from "tsyringe";

@injectable()
export class CreateCartUseCase {
  constructor(private planService: PlanService) {}

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

    // await redis.set(RedisKeys.cart, JSON.stringify(input));

    return plans;
  }
}
