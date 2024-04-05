import { eq, sql } from "drizzle-orm";
import * as schema from "@core/models";
import { planPrice } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { PlanPrice } from "@core/common/enums/models/plan";

@injectable()
export class PlanPriceListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listByPlanId(planId: number): Promise<PlanPrice[]> {
    const result = await this.db
      .select({
        months: planPrice.meses,
        price: planPrice.preco,
        discount_value:
          sql<number>`CAST(${planPrice.desconto_valor} AS DECIMAL(10,2))`.mapWith(
            Number
          ),
        discount_percentage: planPrice.desconto_porcentagem,
        price_with_discount: planPrice.preco_desconto,
      })
      .from(planPrice)
      .where(eq(planPrice.id_plano, planId))
      .execute();

    return result;
  }
}
