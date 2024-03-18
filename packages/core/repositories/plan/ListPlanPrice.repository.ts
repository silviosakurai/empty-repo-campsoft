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
        price: sql<number>`${planPrice.preco}`,
        discount_value: sql<number>`${planPrice.desconto_valor}`,
        discount_percentage: sql<number>`${planPrice.desconto_porcentagem}`,
        price_with_discount: sql<number>`${planPrice.preco_desconto}`,
      })
      .from(planPrice)
      .where(eq(planPrice.id_plano, planId))
      .execute();

    return result;
  }
}
