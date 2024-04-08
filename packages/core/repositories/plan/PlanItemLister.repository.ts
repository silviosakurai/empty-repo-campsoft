import { eq } from "drizzle-orm";
import * as schema from "@core/models";
import { planItem } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { PlanItem } from "@core/common/enums/models/plan";

@injectable()
export class PlanItemListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listByPlanId(planId: number): Promise<PlanItem[]> {
    const result = await this.db
      .select({
        plan_id: planItem.id_plano,
        product_id: planItem.id_produto,
        discountPercent: planItem.percentual_do_plano,
      })
      .from(planItem)
      .where(eq(planItem.id_plano, planId))
      .execute();

    return result;
  }
}