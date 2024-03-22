import { Redis } from "ioredis";
import { CreateCartRequest } from "./dtos/CreateCartRequest.dto";
import { cacheEnvironment } from "@core/config/environments";
import { RedisKeys } from "@core/common/enums/RedisKeys";
import { PlanService, ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { CartOrder, CreateCartResponse } from "./dtos/CreateCartResponse.dto";
import { Plan, PlanPrice } from "@core/common/enums/models/plan";

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

    const totals: CartOrder[] = [];
    for (let plan of plans) {
      for (let price of plan.prices) {
        totals.push(this.generateOrder(price));
      }
    }

    const cart: CreateCartResponse = {
      id: uuidv4(),
      expires_in: 15 * 60 * 60,
      totals: totals,
      products,
      plans: plans,
    };

    await this.saveValuesTemporary(cart);

    return cart;
  }

  private generateOrder(planPrice: PlanPrice): CartOrder {
    const discount_percentage = planPrice.discount_percentage ?? 0;
    const discount_coupon_value = 0; // valor do disconto que o cupom está dando para o cliente, caso o mesmo esteja com um cupom
    const subtotal_price = planPrice.price ?? 0;
    const discount_item_value = planPrice.discount_value ?? 0;
    const discount_products_value = 0; //é o desconto do upgrade, caso o usuário escolha um produto a parte, mostra o valor em si

    return {
      subtotal_price, // valor cheio, quanto que pagaria se comprasse fora do mania
      discount_coupon_value,
      discount_percentage,
      discount_item_value, // de para que está na tela, do valor cheio para o valor da assinatura com desconto
      discount_products_value,
      installments: new Array(+planPrice.months).fill({}).map((_, index) => ({
        installment: index + 1,
        value: +(subtotal_price / planPrice.months).toFixed(2),
      })),
      total:
        subtotal_price -
        (discount_coupon_value + discount_item_value + discount_products_value),
    };
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
