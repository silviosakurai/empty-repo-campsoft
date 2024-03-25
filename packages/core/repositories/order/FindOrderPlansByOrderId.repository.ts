import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { and, eq, sql } from "drizzle-orm";
import * as schema from "@core/models";
import { plan, orderItem, order, planPrice } from "@core/models";
import { PlanVisivelSite } from "@core/common/enums/models/plan";

@injectable()
export class FindOrderPlansByOrderIdRepository {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async find(orderId: string) {
    const result = await this.db
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
        prices: {
          price: planPrice.preco,
          discount_value: planPrice.desconto_valor,
          discount_percentage: planPrice.desconto_porcentagem,
          price_with_discount: planPrice.preco_desconto,
        },
      })
      .from(plan)
      .innerJoin(orderItem, eq(orderItem.id_plano, plan.id_plano))
      .innerJoin(order, eq(order.id_pedido, orderItem.id_pedido))
      .innerJoin(planPrice, eq(planPrice.id_plano, plan.id_plano))
      .where(and(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .groupBy(plan.id_plano)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result;
  }
}
