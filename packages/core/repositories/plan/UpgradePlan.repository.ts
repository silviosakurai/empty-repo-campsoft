import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { clientSignature, clientProductSignature } from "@core/models";
import { eq, and, sql } from "drizzle-orm";
import { Plan, PlanItem } from "@core/common/enums/models/plan";
import { ListPlanRepository } from "./ListPlan.repository";
import { ListPlanItemRepository } from "./ListPlanItem.repository";
import { SignatureStatus } from "@core/common/enums/models/signature";

@injectable()
export class UpgradePlanRepository {
  private db: MySql2Database<typeof schema>;
  private listPlanRepository: ListPlanRepository;
  private listPlanItemRepository: ListPlanItemRepository;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
    this.listPlanRepository = new ListPlanRepository(mySql2Database);
    this.listPlanItemRepository = new ListPlanItemRepository(mySql2Database);
  }

  async get(
    companyId: number,
    clientId: string,
    productIds: string[]
  ): Promise<Plan[] | null> {

    const result = await this.db
      .select(
        {
          client_id: sql`BIN_TO_UUID(${clientSignature.id_cliente})`,
          client_signature_id: sql`BIN_TO_UUID(${clientSignature.id_assinatura_cliente})`,
          status: clientSignature.id_assinatura_status,
          plan_id: clientSignature.id_plano,
        }
      )
      .from(clientSignature)
      .innerJoin(clientProductSignature, eq(clientProductSignature.id_assinatura_cliente, clientSignature.id_assinatura_cliente))
      .where(
        and(
          eq(clientSignature.id_cliente, sql`UUID_TO_BIN(${clientId})`),
          eq(clientSignature.id_assinatura_status, SignatureStatus.ACTIVE),
        ),
      )
      .execute();
      
    if (!result.length) {
      return null;
    }

    const uniquePlans = [...new Set(result.map((item: any) => item.plan_id))].map(planId => ({ plan_id: planId }));

    const plansToUpgrade = await this.calculatePlansNewPrices(uniquePlans[0].plan_id, companyId, productIds);
    
    return plansToUpgrade;
  }

  private getPlanItemByProcutId = (productId: string, planItems: PlanItem[]): number => {
    return planItems.find(planItem => planItem.product_id === productId)?.discountPercent as number;
  }

  private calculatePlansNewPrices = async (planId: any, companyId: number, productIdsToFilter: string[]): Promise<Plan[]> => {
    const plans = await this.listPlanRepository.listWithoutPagination(companyId);
    
    const actualPlan = plans.find(plan => plan.plan_id === planId) as Plan;

    const planItems = await this.listPlanItemRepository.listByPlanId(actualPlan.plan_id);
    const productIds = planItems.map(item => item.product_id) as string[];
    
    const plansToUpgrade = plans.filter(plan => plan.plan_id !== planId);

    let plansToUpgradeWithProductsToFilter: Plan[] = plansToUpgrade;

    if (productIdsToFilter.length > 0) {
      plansToUpgradeWithProductsToFilter = plansToUpgrade.filter(plan => {
        const plansWithProductsFiltered = plan.products.filter(product => productIdsToFilter.includes(product.product_id));
  
        if (plansWithProductsFiltered.length > 0) {
          return plan;
        }
      });
    }

    const plansWithDiscount = plansToUpgradeWithProductsToFilter.map(plan => {
      const productRepeated = plan.products.filter(product => productIds.includes(product.product_id));
      const valueInPercentToSub = productRepeated.reduce((acc, product) => acc + this.getPlanItemByProcutId(product.product_id, planItems), 0);

      plan.prices = plan.prices.map((planPrice: any) => {
        const discountValue = planPrice.price * valueInPercentToSub;
        const priceWithDiscount =  planPrice.price - (planPrice.price * valueInPercentToSub);
        
        planPrice.discount_percentage = parseFloat(valueInPercentToSub.toFixed(2));
        planPrice.discount_value = parseFloat(discountValue.toFixed(2));
        planPrice.price_with_discount = parseFloat(priceWithDiscount.toFixed(2));
        
        return planPrice;
      });

      return plan;
    });

    return plansWithDiscount;
  }
}
