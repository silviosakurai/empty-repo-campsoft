import { and, eq, notInArray } from "drizzle-orm";
import * as schema from "@core/models";
import { plan, planItem, planPrice } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { PlanPrice } from "@core/common/enums/models/plan";
import { Status } from "@core/common/enums/Status";
import { PlanPriceOrder } from "@core/interfaces/repositories/plan";

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
        discount_value: planPrice.desconto_valor,
        discount_percentage: planPrice.desconto_porcentagem,
        price_with_discount: planPrice.preco_desconto,
      })
      .from(planPrice)
      .where(eq(planPrice.id_plano, planId))
      .execute();

    return result;
  }

  async findPriceByPlanIdAndMonth(
    planId: number,
    month: number
  ): Promise<PlanPrice | null> {
    const result = await this.db
      .select({
        months: planPrice.meses,
        price: planPrice.preco,
        discount_value: planPrice.desconto_valor,
        discount_percentage: planPrice.desconto_porcentagem,
        price_with_discount: planPrice.preco_desconto,
      })
      .from(planPrice)
      .innerJoin(plan, eq(plan.id_plano, planPrice.id_plano))
      .where(
        and(
          eq(planPrice.id_plano, planId),
          eq(planPrice.meses, month),
          eq(plan.status, Status.ACTIVE)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as PlanPrice;
  }

  /* async findPriceByPlanIdAndMonthNotProducts(
    planId: number,
    month: number,
    selectedProducts: string[]
  ): Promise<PlanPriceOrder[]> {
    const result = await this.db
      .select({
        id_produt: planItem.id_produto,
        plan_percentage: planItem.percentual_do_plano,
      })
      .from(planItem)
      .innerJoin(plan, eq(plan.id_plano, planItem.id_plano))
      .innerJoin(planPrice, eq(planItem.id_plano, planPrice.id_plano))
      .where(
        and(
          eq(planPrice.id_plano, planId),
          eq(planPrice.meses, month),
          eq(plan.status, Status.ACTIVE),
          notInArray(planItem.id_produto, selectedProducts)
        )
      )
      .execute();

    if (!result.length) {
      return [] as PlanPriceOrder[];
    }

    return result as unknown as PlanPriceOrder[];
  } */
}
