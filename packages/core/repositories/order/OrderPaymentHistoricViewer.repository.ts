import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { orderPayment } from "@core/models";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { and, eq, sql } from "drizzle-orm";

import { ListOrderRequestDto } from "@core/useCases/order/dtos/ListOrderRequest.dto";
import { ViewOrderPaymentHistoricRequest } from "@core/useCases/order/dtos/ViewOrderPaymentHistoricRequest.dto";

@injectable()
export class OrderPaymentHistoricViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(
    orderNumber: ViewOrderPaymentHistoricRequest,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ) {
    try {
      const result = await this.db
        .select({
          payment_order_id: sql<string>`BIN_TO_UUID(${orderPayment.id_pedido_pagamento})`,
        })
        .from(orderPayment)
        .where(
          and(
            eq(orderPayment.id_pedido, sql<string>`UUID_TO_BIN(${orderNumber})`)
          )
        )
        .execute();

      // const result = await this.db
      //   .select({
      //     order_id: sql<string>`BIN_TO_UUID(${order.id_pedido})`,
      //     client_id: sql<string>`BIN_TO_UUID(${order.id_cliente})`,
      //     seller_id: sql<string>`BIN_TO_UUID(${order.id_vendedor})`,
      //     status: orderStatus.pedido_status,
      //     totals: {
      //       subtotal_price: sql`${order.valor_preco}`.mapWith(Number),
      //       discount_item_value: sql`${order.valor_desconto}`.mapWith(Number),
      //       discount_coupon_value: sql<number>`CASE
      //         WHEN ${order.valor_cupom} IS NOT NULL
      //           THEN SUM(${order.valor_cupom})
      //         ELSE 0
      //       END`.mapWith(Number),
      //       discount_product_value: sql<number>`CASE
      //         WHEN ${order.desconto_produto} IS NOT NULL
      //           THEN SUM(${order.desconto_produto})
      //         ELSE 0
      //       END`.mapWith(Number),
      //       discount_percentage: sql<number>`CASE
      //         WHEN ${order.valor_total} > 0
      //           THEN ROUND((${order.valor_desconto} / ${order.valor_total}) * 100)
      //         ELSE 0
      //       END`.mapWith(Number),
      //       total: sql`${order.valor_total}`.mapWith(Number),
      //     },
      //     installments: {
      //       installment: order.pedido_parcelas_vezes,
      //       value: sql`${order.pedido_parcelas_valor}`.mapWith(Number),
      //     },
      //     created_at: order.created_at,
      //     updated_at: order.updated_at,
      //   })
      //   .from(order)
      //   .innerJoin(
      //     orderStatus,
      //     eq(orderStatus.id_pedido_status, order.id_pedido_status)
      //   )
      //   .where(
      //     and(
      //       eq(order.id_parceiro, tokenKeyData.id_parceiro),
      //       eq(order.id_cliente, sql`UUID_TO_BIN(${tokenJwtData.clientId})`)
      //     )
      //   )
      //   .groupBy(order.id_pedido)
      //   .execute();
      console.log("orderNumber", orderNumber);
      console.log("result", result);

      if (result.length === 0) {
        return [];
      }

      return result;
    } catch (error) {
      console.log("error", error);
    }
  }
}
