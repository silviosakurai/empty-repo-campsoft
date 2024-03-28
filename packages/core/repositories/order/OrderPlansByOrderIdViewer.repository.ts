import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { and, eq, sql } from "drizzle-orm";
import * as schema from "@core/models";
import { plan, orderItem, order, planPrice } from "@core/models";
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
  ): Promise<FindOrderByNumberPlans[]> {
    const results = await this.db
      .select({
        plan_id: plan.id_plano,
        status: plan.status,
        visible_site: sql<boolean>`CASE 
          WHEN ${plan.visivel_site} = ${PlanVisivelSite.YES} THEN true
          ELSE false
        END`,
        business_id: plan.id_empresa,
        plan: plan.plano,
        image: plan.imagem,
        description: plan.descricao,
        short_description: plan.descricao_curta,
      })
      .from(plan)
      .innerJoin(orderItem, eq(orderItem.id_plano, plan.id_plano))
      .innerJoin(order, eq(order.id_pedido, orderItem.id_pedido))
      .innerJoin(planPrice, eq(planPrice.id_plano, plan.id_plano))
      .where(
        and(
          eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`),
          eq(plan.id_empresa, tokenKeyData.company_id)
        )
      )
      .groupBy(plan.id_plano)
      .execute();

    if (results.length === 0) {
      return [];
    }

    const records = this.complementPlansWithProducts(tokenKeyData, results);

    return records;
  }

  private async complementPlansWithProducts(
    tokenKeyData: ITokenKeyData,
    results: PlanDetails[]
  ) {
    const planPromises = results.map(async (plan: PlanDetails) => ({
      ...plan,
      prices: await this.pricesByPlanIdLister.find(plan.plan_id),
      plan_products: await this.planProductDetailsLister.list(
        plan.plan_id,
        tokenKeyData
      ),
      product_groups: await this.planProductGroupDetailsLister.list(
        plan.plan_id,
        tokenKeyData
      ),
    }));

    const enrichedPlans = await Promise.all(planPromises);

    return enrichedPlans;
  }
}
