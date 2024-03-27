import { CreateCartRequest } from "./dtos/CreateCartRequest.dto";
import { PlanService, ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { CartOrder, CreateCartResponse } from "./dtos/CreateCartResponse.dto";
import { Plan, PlanPrice } from "@core/common/enums/models/plan";
import { UpgradeUseCase } from "../plan/UpgradePlan.useCase";
import OpenSearchService from "@core/services/openSearch.service";
import { ProductResponse } from "../product/dtos/ProductResponse.dto";

@injectable()
export class CreateCartUseCase {
  constructor(
    private planService: PlanService,
    private upgradeUseCase: UpgradeUseCase,
    private productService: ProductService,
    private openSearchService: OpenSearchService
  ) {}

  async create(input: CreateCartRequest, companyId: number, clientId: string) {
    const products = input.products_id?.length
      ? await this.productService.findProductsByIds(
          companyId,
          input.products_id
        )
      : [];

    if (!input.plans_id?.length) {
      const cart = await this.createCart([], products, []);

      return cart;
    }

    const plans = await Promise.all(
      input.plans_id.map(
        (item) => this.planService.viewPlan(companyId, item) as Promise<Plan>
      )
    );

    const productsIdToDiscount = plans
      .map((item) => item?.products?.map((product) => product?.product_id))
      .join()
      .split(",");

    const allPlansWithDiscounts = await this.generateDiscountProductsValue(
      companyId,
      clientId,
      productsIdToDiscount
    );

    if (!allPlansWithDiscounts.length) {
      const totals = this.generateOrders(plans);

      const cart = await this.createCart(totals, products, plans);

      return cart;
    }

    const selectedPlansWithDiscount = this.setSelectedPlans(
      allPlansWithDiscounts,
      input.plans_id
    );

    const plansAsMarketInterface = this.formatPlanValuesToCart(
      selectedPlansWithDiscount
    );

    const totals = this.generateOrders(plansAsMarketInterface);

    const cart = await this.createCart(
      totals,
      products,
      plansAsMarketInterface
    );

    return cart;
  }

  private async createCart(
    totals: CartOrder[],
    products: ProductResponse[],
    plans: Plan[]
  ) {
    const cart: CreateCartResponse = {
      id: uuidv4(),
      totals: totals,
      products,
      plans: plans,
    };

    await this.openSearchService.indexCart(cart);

    return cart;
  }

  private generateOrders(plans: Plan[]): CartOrder[] {
    const totals: CartOrder[] = [];
    for (const plan of plans) {
      if (plan.prices.length) {
        for (const price of plan.prices) {
          const discount_percentage = price.discount_percentage ?? 0;
          const discount_coupon_value = 0; // valor do desconto que o cupom está dando para o cliente, caso o mesmo esteja com um cupom
          const subtotal_price = price.price ?? 0;
          const discount_item_value = price.discount_value ?? 0;
          const discount_products_value = parseFloat(
            (discount_item_value * +(price.discount_percentage ?? 0)).toFixed(2)
          );

          totals.push({
            subtotal_price,
            discount_coupon_value,
            discount_percentage,
            discount_item_value,
            discount_products_value,
            installments: new Array(+price.months).fill({}).map((_, index) => ({
              installment: index + 1,
              value: +(subtotal_price / price.months).toFixed(2),
            })),
            total: parseFloat(
              (
                subtotal_price -
                (discount_coupon_value + discount_item_value)
              ).toFixed(2)
            ),
          });
        }
      }
    }

    return totals;
  }

  private async generateDiscountProductsValue(
    companyId: number,
    clientId: string,
    productsId: string[]
  ) {
    const results = await this.upgradeUseCase.execute(
      companyId,
      clientId,
      productsId
    );

    if (!results) return [];

    return results;
  }

  private setSelectedPlans(
    plansWithDiscount: Plan[],
    selectedPlansId: number[]
  ) {
    const selectedPlans = plansWithDiscount.filter((item) =>
      selectedPlansId.some((selectedPlanId) => selectedPlanId === item.plan_id)
    );

    return selectedPlans;
  }

  private formatPlanValuesToCart(plans: Plan[]): Plan[] {
    return plans.map(
      (item): Plan => ({
        plan_id: item.plan_id,
        status: item.status,
        visible_site: item.visible_site,
        business_id: item.business_id,
        plan: item.plan,
        image: item.image,
        description: item.description,
        short_description: item.short_description,
        created_at: item.created_at,
        updated_at: item.updated_at,
        prices: item.prices,
        products: item.products,
        product_groups: item.product_groups,
      })
    );
  }
}

// pelo jwt, logar em todas as assinaturas que o usuário já tem
// vou bater na tabela assinatura que com ela eu bato nos pedidos(ativos) por ela e
// depois em pedidos itens, que ai vou saber todos os produtos que ele tem
// e ai verifico se os produtos que ele quer adicionar tem já
