import { and, eq, isNotNull } from "drizzle-orm";
import * as schema from "@core/models";
import { plan, planItem } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { CreateOrderRequestDto } from "@core/useCases/order/dtos/CreateOrderRequest.dto";
import { Status } from "@core/common/enums/Status";
import { PlanListerOrderResponse } from "@core/interfaces/repositories/plan";

@injectable()
export class PlanListerOrderRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listByPlanOrder(
    tokenKeyData: ITokenKeyData,
    payload: CreateOrderRequestDto
  ): Promise<PlanListerOrderResponse[]> {
    const result = await this.db
      .select({
        product_id: planItem.id_produto,
      })
      .from(plan)
      .innerJoin(planItem, eq(planItem.id_plano, plan.id_plano))
      .where(
        and(
          eq(plan.id_plano, payload.plan.plan_id),
          eq(plan.status, Status.ACTIVE),
          eq(plan.id_empresa, tokenKeyData.company_id),
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