import { and, eq, isNotNull } from "drizzle-orm";
import * as schema from "@core/models";
import { plan, planItem, planPartner } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { Status } from "@core/common/enums/Status";
import { PlanListerOrderResponse } from "@core/interfaces/repositories/plan";

@injectable()
export class PlanListerOrderRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listByPlanOrder(
    partnerId: number,
    planId: number
  ): Promise<PlanListerOrderResponse[]> {
    const result = await this.db
      .select({
        product_id: planItem.id_produto,
      })
      .from(plan)
      .innerJoin(planItem, eq(planItem.id_plano, plan.id_plano))
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
      .where(
        and(
          eq(plan.id_plano, planId),
          eq(plan.status, Status.ACTIVE),
          eq(planPartner.id_parceiro, partnerId),
          isNotNull(planItem.id_produto)
        )
      )
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result as PlanListerOrderResponse[];
  }
}
