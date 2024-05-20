import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { order, orderStatus } from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { OrderPaymentByOrderIdViewerRepository } from "./OrderPaymentByOrderIdViewer.repository";
import { OrderPlansByOrderIdViewerRepository } from "./OrderPlansByOrderIdViewer.repository";
import {
  OrderByNumberByManagerResponse,
  OrderByNumberResponse,
} from "@core/interfaces/repositories/order";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { ClientViewerRepository } from "../client/ClientViewer.repository";
import { CartDocumentManager } from "@core/interfaces/repositories/cart";

@injectable()
export class OrderByNumberViewerByManagerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>,
    private readonly orderPlansByOrderIdViewer: OrderPlansByOrderIdViewerRepository,
    private readonly orderPaymentByOrderIdViewer: OrderPaymentByOrderIdViewerRepository,
    private readonly clientViewerRepository: ClientViewerRepository
  ) {}

  async view(
    orderNumber: string,
    tokenJwtData: ITokenJwtData,
    cart: CartDocumentManager
  ): Promise<OrderByNumberByManagerResponse | null> {
    const record = await this.db
      .select({
        order_id: sql`BIN_TO_UUID(${order.id_pedido})`.mapWith(String),
        client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
        seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
        plan_id: order.id_plano,
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
          eq(order.id_parceiro, cart.partner_id),
          eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
        )
      );

    if (!record.length) {
      return null;
    }

    const results = await this.completePaymentsAndPlansPromises(
      record[0],
      cart
    );

    return results;
  }

  private async completePaymentsAndPlansPromises(
    result: Omit<
      OrderByNumberResponse,
      "payments" | "products" | "plan" | "single_products"
    >,
    cart: CartDocumentManager
  ): Promise<OrderByNumberByManagerResponse | null> {
    const [client, seller, payments, plan] = await Promise.all([
      this.clientViewerRepository.view(result.client_id),
      this.clientViewerRepository.view(result.seller_id),
      this.orderPaymentByOrderIdViewer.find(result.order_id),
      this.orderPlansByOrderIdViewer.view(result.order_id, cart.partner_id),
    ]);

    const newResult = {
      client: {
        client_id: client?.client_id,
        client_name: client?.first_name,
      },
      seller: {
        seller_id: seller?.client_id,
        seller_name: seller?.first_name,
      },
    };

    return {
      ...result,
      ...newResult,
      payments,
      plan,
    };
  }
}