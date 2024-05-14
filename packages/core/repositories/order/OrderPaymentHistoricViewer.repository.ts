import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import {
  order,
  orderPayment,
  orderPaymentMethod,
  orderPaymentStatus,
  clientCards,
} from "@core/models";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { and, eq, sql } from "drizzle-orm";
import {
  OrderHistoricResponse,
  OrderPaymentsMethodsEnum,
} from "@core/common/enums/models/order";

@injectable()
export class OrderPaymentHistoricViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(
    orderNumber: string,
    tokenKeyData: ITokenKeyData,
    tokenJwtData: ITokenJwtData
  ): Promise<OrderHistoricResponse[]> {
    const result = await this.db
      .select({
        payment_order_id: sql<string>`BIN_TO_UUID(${orderPayment.id_pedido_pagamento})`,
        date: orderPayment.data_pagamento,
        method: {
          type: orderPaymentMethod.pedido_pag_metodo,
          code: sql<string>`CASE 
            WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.CARD} 
              THEN ${clientCards.last_digits}
            WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.VOUCHER} 
              THEN ${orderPayment.voucher}
              ELSE ${orderPayment.codigo_pagamento}
            END`,
          brand: sql<string>`CASE 
            WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.CARD} 
              THEN ${clientCards.brand}
              ELSE NULL
            END`,
        },
        value: sql<number>`CASE 
          WHEN ${orderPayment.id_pedido_pagamento_atrelado} IS NOT NULL AND ${orderPayment.valor_desconto_ordem_anterior} > 0
            THEN ${orderPayment.valor_desconto_ordem_anterior}
            ELSE ${orderPayment.valor_total}
          END`,
        status: orderPaymentStatus.pedido_pagamento_status,
      })
      .from(orderPayment)
      .innerJoin(
        orderPaymentMethod,
        eq(
          orderPaymentMethod.id_pedido_pag_metodo,
          orderPayment.id_pedido_pag_metodo
        )
      )
      .innerJoin(
        orderPaymentStatus,
        eq(
          orderPaymentStatus.id_pedido_pagamento_status,
          orderPayment.id_pedido_pagamento_status
        )
      )
      .innerJoin(order, eq(order.id_pedido, orderPayment.id_pedido))
      .leftJoin(clientCards, eq(clientCards.card_id, orderPayment.card_id))
      .where(
        and(
          eq(orderPayment.id_pedido, sql<string>`UUID_TO_BIN(${orderNumber})`),
          eq(
            orderPayment.id_cliente,
            sql<string>`UUID_TO_BIN(${tokenJwtData.clientId})`
          ),
          eq(order.id_parceiro, tokenKeyData.id_parceiro)
        )
      )
      .execute();

    if (result.length === 0) {
      return [] as OrderHistoricResponse[];
    }

    return result as OrderHistoricResponse[];
  }
}
