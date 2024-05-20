import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { order, orderStatus } from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { OrderPlansByOrderIdViewerRepository } from "./OrderPlansByOrderIdViewer.repository";
import { OrderByNumberCreateResponse } from "@core/interfaces/repositories/order";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { OrderPaymentByOrderIdCreateViewerRepository } from "./OrderPaymentByOrderIdCreateViewer.repository";

@injectable()
export class OrderByNumberCreateViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly orderPlansByOrderIdViewer: OrderPlansByOrderIdViewerRepository,
    private readonly orderPaymentByOrderIdCreateViewerRepository: OrderPaymentByOrderIdCreateViewerRepository
  ) {}

  async view(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<OrderByNumberCreateResponse | null> {
    const record = await this.db
      .select({
        order_id: sql`BIN_TO_UUID(${order.id_pedido})`.mapWith(String),
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
        status: orderStatus.pedido_status,
        totals: {
          subtotal_price: sql`${order.valor_preco}`.mapWith(Number),
          discount_item_value: sql`${order.valor_desconto}`.mapWith(Number),
          discount_coupon_value:
            sql<number>`COALESCE(${order.valor_cupom}, 0)`.mapWith(Number),
          discount_product_value:
            sql<number>`COALESCE(${order.desconto_produto}, 0)`.mapWith(Number),
          discount_percentage: sql<number>`CASE 
            WHEN ${order.valor_total} > 0 AND ${order.valor_desconto} IS NOT NULL
              THEN ROUND((${order.valor_desconto} / ${order.valor_total}) * 100, 2)
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
          eq(order.id_parceiro, tokenKeyData.id_parceiro),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      );

    if (!record.length) {
      return null;
    }

    const results = await this.completePaymentsAndPlansPromises(
      record[0],
      tokenKeyData
    );

    return results;
  }

  private async completePaymentsAndPlansPromises(
    result: Omit<OrderByNumberCreateResponse, "payments" | "products" | "plan">,
    tokenKeyData: ITokenKeyData
  ): Promise<OrderByNumberCreateResponse | null> {
    const [payments, plan] = await Promise.all([
      this.orderPaymentByOrderIdCreateViewerRepository.find(result.order_id),
      this.orderPlansByOrderIdViewer.view(
        result.order_id,
        tokenKeyData.id_parceiro
      ),
    ]);

    return {
      ...result,
      payments,
      plan,
    };
  }
}