import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan, planPartner, planItem, planPrice } from "@core/models";
import { eq, and } from "drizzle-orm";
import { PlanVisivelSite } from "@core/common/enums/models/plan";
import { Status } from "@core/common/enums/Status";
import { PlanListByProduct } from "@core/useCases/plan/dtos/ListPlanResponse.dto";

@injectable()
export class PlanListerByProductRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    partnerId: number,
    productId: string
  ): Promise<PlanListByProduct[]> {
    const select = await this.db
      .select({
        plan_id: plan.id_plano,
        name: plan.plano,
        low_price: planPrice.preco_desconto,
      })
      .from(plan)
      .innerJoin(planPartner, eq(planPartner.id_plano, plan.id_plano))
      .innerJoin(
        planItem,
        and(
          eq(planItem.id_plano, plan.id_plano),
          eq(planItem.id_produto, productId)
        )
      )
      .innerJoin(planPrice, and(eq(planPrice.id_plano, plan.id_plano)))
      .where(
        and(
          eq(planPartner.id_parceiro, partnerId),
          eq(plan.status, Status.ACTIVE),
          eq(plan.visivel_site, PlanVisivelSite.YES)
        )
      )
      .groupBy(plan.id_plano)
      .execute();

    if (!select?.length) {
      return [] as PlanListByProduct[];
    }

    return select as PlanListByProduct[];
  }
}
