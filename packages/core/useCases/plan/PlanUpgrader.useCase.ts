import { PlanService } from "@core/services";
import { injectable } from "tsyringe";
import { Plan, PlanItem } from "@core/common/enums/models/plan";

@injectable()
export class PlanUpgraderUseCase {
  constructor(private readonly planService: PlanService) {}

  async execute(
    companyId: number,
    clientId: string,
    productIds: string[]
  ): Promise<Plan[] | null> {
    const upgradePlanResponse = await this.planService.upgrade(
      companyId,
      clientId,
      productIds
    );

    if (!upgradePlanResponse) {
      return null;
    }

    const { plans, planItems } = upgradePlanResponse;

    return this.plansWithDiscount(plans, planItems);
  }

  private plansWithDiscount(plans: Plan[], planItems: PlanItem[]) {
    const productIds = planItems.map((item) => item.product_id) as string[];

    return plans.map((plan) => {
      const productRepeated = plan.products.filter((product) =>
        productIds.includes(product.product_id)
      );
      const valueInPercentToSub = productRepeated.reduce(
        (acc, product) =>
          acc + this.getPlanItemByProcutId(product.product_id, planItems),
        0
      );

      plan.prices = plan.prices.map((planPrice) => {
        if (planPrice.price) {
          const discountValue = planPrice.price * valueInPercentToSub;
          const priceWithDiscount =
            planPrice.price - planPrice.price * valueInPercentToSub;

          planPrice.discount_percentage = parseFloat(
            valueInPercentToSub.toFixed(2)
          );
          planPrice.discount_value = parseFloat(discountValue.toFixed(2));
          planPrice.price_with_discount = parseFloat(
            priceWithDiscount.toFixed(2)
          );
        }

        return planPrice;
      });

      return plan;
    });
  }

  private getPlanItemByProcutId = (
    productId: string,
    planItems: PlanItem[]
  ): number => {
    return planItems.find((planItem) => planItem.product_id === productId)
      ?.discountPercent as number;
  };
}
