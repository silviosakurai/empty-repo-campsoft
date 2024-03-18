import { eq, sql } from "drizzle-orm";
import * as schema from "@core/models";
import { planPrice } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { PlanPrice } from "@core/common/enums/models/plan";

@injectable()
export class ListPlanPriceRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async listByPlanId(planId: number): Promise<PlanPrice[]> {
    const result = await this.db
      .select({
        months: planPrice.meses,
        price: sql<number>`CAST(${planPrice.preco} AS DECIMAL(10,2))`,
        discount_value: sql<number>`CAST(${planPrice.desconto_valor} AS DECIMAL(10,2))`,
        discount_percentage: sql<number>`CAST(${planPrice.desconto_porcentagem} AS DECIMAL(10,2))`,
        price_with_discount: sql<number>`CAST(${planPrice.preco_desconto} AS DECIMAL(10,2))`,
      })
      .from(planPrice)
      .where(eq(planPrice.id_plano, planId))
      .execute();

    return result;
  }
}
