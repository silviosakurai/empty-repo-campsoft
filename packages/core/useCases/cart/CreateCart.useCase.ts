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

  async create(input: CreateCartRequest, companyId: number, clientId: string) {
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

    const productsIdToDiscount = plans
      ?.map((item) => item?.products?.map((product) => product?.product_id))
      .join()
      .split(",");

    const productsToDiscount = await this.generateDiscountProductsValue(
      companyId,
      clientId,
      productsIdToDiscount
    );

    const totals: CartOrder[] = [];
    for (let plan of plans) {
      for (let price of plan.prices) {
        totals.push(this.generateOrder(price));
      }
    }

    const fifteenMinutesInMilliseconds = 15 * 60 * 60;

    const cart: CreateCartResponse = {
      id: uuidv4(),
      expires_in: fifteenMinutesInMilliseconds,
      totals: totals,
      products,
      plans: plans,
    };

    await this.saveValuesTemporarily(cart);

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

  private async saveValuesTemporarily(cart: CreateCartResponse) {
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

  private async generateDiscountProductsValue(
    companyId: number,
    clientId: string,
    productsId: string[]
  ) {
    const results = await this.planService.upgradePlan(
      companyId,
      clientId,
      productsId
    );
    console.log(results);
  }
}

// pelo jwt, logar em todas as assinaturas que o usuário já tem
// vou bater na tabela assinatura que com ela eu bato nos pedidos(ativos) por ela e
// depois em pedidos itens, que ai vou saber todos os produtos que ele tem
// e ai verifico se os produtos que ele quer adicionar tem já
