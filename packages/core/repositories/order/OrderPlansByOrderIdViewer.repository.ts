import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { and, eq, sql } from "drizzle-orm";
import * as schema from "@core/models";
import { plan, order, planPrice, planPartner } from "@core/models";
import { PlanVisivelSite } from "@core/common/enums/models/plan";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { PricesByPlanIdListerRepository } from "../plan/PricesByPlanIdLister.repository";
import { PlanProductDetailsListerRepository } from "../plan/PlanProductDetailsLister.repository";
import { PlanDetails } from "@core/interfaces/repositories/order";
import { PlanProductGroupDetailsListerRepository } from "../plan/PlanProductGroupDetailsLister.repository";
import { FindOrderByNumberPlans } from "@core/useCases/order/dtos/FindOrderByNumberResponse.dto";

@injectable()
export class OrderPlansByOrderIdViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly pricesByPlanIdLister: PricesByPlanIdListerRepository,
    private readonly planProductDetailsLister: PlanProductDetailsListerRepository,
    private readonly planProductGroupDetailsLister: PlanProductGroupDetailsListerRepository
  ) {}

  async view(
    orderId: string,
    tokenKeyData: ITokenKeyData
  ): Promise<FindOrderByNumberPlans | null> {
    const results = await this.db
      .select({
        plan_id: plan.id_plano,
        status: plan.status,
        visible_site: sql<boolean>`CASE 
          WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
          ELSE false
        END`.mapWith(Boolean),
        business_id: planPartner.id_parceiro,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
      })
      .from(plan)
      .innerJoin(order, eq(order.id_plano, plan.id_plano))
      .innerJoin(planPrice, eq(planPrice.id_plano, plan.id_plano))
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
      .where(
        and(
          eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`),
          eq(planPartner.id_parceiro, tokenKeyData.company_id)
        )
      )
      .groupBy(plan.id_plano)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return this.complementPlansWithProducts(tokenKeyData, results[0]);
  }

  private async complementPlansWithProducts(
    tokenKeyData: ITokenKeyData,
    result: PlanDetails
  ): Promise<FindOrderByNumberPlans> {
    const [prices, planProducts, productGroups] = await Promise.all([
      this.pricesByPlanIdLister.find(result.plan_id),
      this.planProductDetailsLister.list(result.plan_id, tokenKeyData),
      this.planProductGroupDetailsLister.list(result.plan_id, tokenKeyData),
    ]);

    return {
      ...result,
      prices,
      plan_products: planProducts,
      product_groups: productGroups,
    };
  }
}
