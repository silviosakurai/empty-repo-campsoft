import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { plan } from "@core/models";
import { eq, and } from "drizzle-orm";
import { PlanViewerCart } from "@core/common/enums/models/plan";

@injectable()
export class PlanViewerCartRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(planId: number): Promise<PlanViewerCart | null> {
    const result = await this.db
      .select({
        plan_id: plan.id_plano,
        name: plan.plano,
        image: plan.imagem,
        short_description: plan.descricao_curta,
      })
      .from(plan)
      .where(and(eq(plan.id_plano, planId)))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as PlanViewerCart;
  }
}
