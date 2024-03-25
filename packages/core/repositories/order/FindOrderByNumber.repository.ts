import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import {
  order,
  orderStatus,
  orderPaymentMethod,
  orderPaymentStatus,
} from "@core/models";
import { eq, sql } from "drizzle-orm";
import { FindOrderPaymentByOrderIdRepository } from "./FindOrderPaymentByOrderId.repository";
import { FindOrderPlanProductsByOrderIdRepository } from "./FindOrderPlanProductsByOrderId.repository";
import { FindOrderPlansByOrderIdRepository } from "./FindOrderPlansByOrderId.repository";
import { FindOrderPlansProductGroupsByOrderIdRepository } from "./FindOrderPlansProductGroupsByOrderId.repository";

@injectable()
export class FindOrderByNumberRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly findOrderPlansByOrderId: FindOrderPlansByOrderIdRepository,
    private readonly findOrderPaymentByOrderId: FindOrderPaymentByOrderIdRepository,
    private readonly findOrderPlanProductsByOrderId: FindOrderPlanProductsByOrderIdRepository,
    private readonly findOrderPlansProductGroupsByOrderId: FindOrderPlansProductGroupsByOrderIdRepository
  ) {}

  async find(orderNumber: string) {
    const record = await this.db
      .select({
        order_id: sql`BIN_TO_UUID(${order.id_pedido})`,
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
        status: orderStatus.pedido_status,
      })
      .from(order)
      .groupBy(order.id_pedido)
      .innerJoin(
        orderStatus,
        eq(orderStatus.id_pedido_status, order.id_pedido_status)
      )
      .where(eq(order.id_pedido, sql`UUID_TO_BIN(${orderNumber})`));

    if (!record.length) return null;

    const results = await this.completePaymentsAndPlansPromises(record[0]);

    return results;
  }

  private async completePaymentsAndPlansPromises(result: any) {
    const paymentsAndPlans = {
      ...result,
      payments: await this.findOrderPaymentByOrderId.find(result.order_id),
      plans: await this.findOrderPlansByOrderId.find(result.order_id),
      plan_products: await this.findOrderPlanProductsByOrderId.find(
        result.order_id
      ),
      product_groups: await this.findOrderPlansProductGroupsByOrderId.find(
        result.order_id
      ),
    };

    return paymentsAndPlans;
  }
}
