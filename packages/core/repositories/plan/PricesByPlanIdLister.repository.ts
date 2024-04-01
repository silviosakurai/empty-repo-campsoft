import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { and, eq } from "drizzle-orm";
import * as schema from "@core/models";
import { planPrice } from "@core/models";
import { Prices } from "@core/interfaces/repositories/order";

@injectable()
export class PricesByPlanIdListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(planId: number): Promise<Prices[]> {
    const result = await this.db
      .select({
        price: planPrice.preco,
        discount_value: planPrice.desconto_valor,
        discount_percentage: planPrice.desconto_porcentagem,
        price_with_discount: planPrice.preco_desconto,
      })
      .from(planPrice)
      .where(and(eq(planPrice.id_plano, planId)))
      .execute();

    if (result.length === 0) {
      return [];
    }

    return result as Prices[];
  }
}
