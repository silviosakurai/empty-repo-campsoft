import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { order, orderStatus } from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { OrderPaymentByOrderIdViewerRepository } from "./OrderPaymentByOrderIdViewer.repository";
import { OrderPlansByOrderIdViewerRepository } from "./OrderPlansByOrderIdViewer.repository";
import { OrderByNumberResponse } from "@core/interfaces/repositories/order";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class OrderByNumberViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly orderPlansByOrderIdViewer: OrderPlansByOrderIdViewerRepository,
    private readonly orderPaymentByOrderIdViewer: OrderPaymentByOrderIdViewerRepository
  ) {}

  async view(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<OrderByNumberResponse | null> {
    const record = await this.db
      .select({
        order_id: sql`BIN_TO_UUID(${order.id_pedido})`.mapWith(String),
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
        status: orderStatus.pedido_status,
        totals: {
          subtotal_price: sql`${order.valor_preco}`.mapWith(Number),
          discount_item_value: sql`${order.valor_desconto}`.mapWith(Number),
          discount_coupon_value: sql<number>`CASE
            WHEN ${order.valor_cupom} IS NOT NULL 
              THEN SUM(${order.valor_cupom}) 
            ELSE 0
          END`.mapWith(Number),
          discount_percentage: sql<number>`CASE 
            WHEN ${order.valor_total} > 0 
              THEN ROUND((${order.valor_desconto} / ${order.valor_total}) * 100)
            ELSE 0 
          END`.mapWith(Number),
          discount_product_value: sql<number>`CASE
            WHEN ${order.desconto_produto} IS NOT NULL 
              THEN SUM(${order.desconto_produto}) 
            ELSE 0
          END`.mapWith(Number),
          total: sql`${order.valor_total}`.mapWith(Number),
        },
        installments: {
          installment: sql`${order.pedido_parcelas_vezes}`.mapWith(Number),
          value: sql`${order.pedido_parcelas_valor}`.mapWith(Number),
        },
        created_at: order.created_at,
        updated_at: order.updated_at,
      })
      .from(order)
      .groupBy(order.id_pedido)
      .innerJoin(
        orderStatus,
        eq(orderStatus.id_pedido_status, order.id_pedido_status)
      )
      .where(
        and(
          eq(order.id_pedido, sql`UUID_TO_BIN(${orderNumber})`),
          eq(order.id_empresa, tokenKeyData.company_id),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      );

    if (!record.length) return null;

    const results = await this.completePaymentsAndPlansPromises(
      record[0],
      tokenKeyData
    );

    return results;
  }

  private async completePaymentsAndPlansPromises(
    result: Omit<OrderByNumberResponse, "payments" | "products" | "plans">,
    tokenKeyData: ITokenKeyData
  ): Promise<OrderByNumberResponse> {
    const recordsFormatted = {
      ...result,
      payments: await this.orderPaymentByOrderIdViewer.find(result.order_id),
      plans: await this.orderPlansByOrderIdViewer.view(
        result.order_id,
        tokenKeyData
      ),
    };

    return recordsFormatted;
  }
}
