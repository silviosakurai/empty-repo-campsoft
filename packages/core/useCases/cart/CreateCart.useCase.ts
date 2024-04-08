import { CreateCartRequest } from "./dtos/CreateCartRequest.dto";
import { PlanService, ProductService } from "@core/services";
import { injectable } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import { CartOrder, CreateCartResponse } from "./dtos/CreateCartResponse.dto";
import { Plan } from "@core/common/enums/models/plan";
import { PlanUpgraderUseCase } from "../plan/PlanUpgrader.useCase";
import OpenSearchService from "@core/services/openSearch.service";
import { ProductResponse } from "../product/dtos/ProductResponse.dto";
import { CouponService } from "@core/services/coupon.service";

@injectable()
export class CreateCartUseCase {
  constructor(
    private readonly planService: PlanService,
    private readonly couponService: CouponService,
    private readonly productService: ProductService,
    private readonly openSearchService: OpenSearchService,
    private readonly planUpgraderUseCase: PlanUpgraderUseCase
  ) {}

  async create(input: CreateCartRequest, companyId: number, clientId: string) {
    const products = input.products_id?.length
      ? await this.productService.findProductsByIds(
          companyId,
          input.products_id
        )
      : [];

    if (!input.plans_id?.length) {
      const cart = await this.createCart([], products, [], clientId);

      return cart;
    }

    const plans = await Promise.all(
      input.plans_id.map(
        (item) => this.planService.view(companyId, item) as Promise<Plan>
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

    const discountCouponValue = input.discount_coupon
      ? (await this.couponService.view(input.discount_coupon, companyId))[0]
          .discount_coupon_value ?? 0
      : 0;

    if (!allPlansWithDiscounts.length) {
      const totals = this.generateOrders(plans, discountCouponValue);

      const cart = await this.createCart(totals, products, plans, clientId);

      return cart;
    }

    const selectedPlansWithDiscount = this.setSelectedPlans(
      allPlansWithDiscounts,
      input.plans_id
    );

    const plansAsCartInterface = this.formatPlanValuesToCart(
      selectedPlansWithDiscount
    );

    const totals = this.generateOrders(
      plansAsCartInterface,
      discountCouponValue
    );

    const cart = await this.createCart(
      totals,
      products,
      plansAsCartInterface,
      clientId
    );

    return cart;
  }

  private async createCart(
    totals: CartOrder[],
    products: ProductResponse[],
    plans: Plan[],
    clientId: string
  ) {
    const cart: CreateCartResponse = {
      id: uuidv4(),
      totals: totals,
      products,
      plans,
    };

    await this.openSearchService.indexCart(clientId, cart);

    return cart;
  }

  private generateOrders(
    plans: Plan[],
    discountCouponValue: number
  ): CartOrder[] {
    const totals: CartOrder[] = [];
    for (const plan of plans) {
      if (plan.prices.length) {
        for (const price of plan.prices) {
          const discount_percentage = price.discount_percentage ?? 0;
          const discount_coupon_value = discountCouponValue;
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
            installments: price.months
              ? new Array(+price.months).fill({}).map((_, index) => ({
                  installment: index + 1,
                  value: +(subtotal_price / +(price.months ?? 0)).toFixed(2),
                }))
              : [],
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
    const results = await this.planUpgraderUseCase.execute(
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
