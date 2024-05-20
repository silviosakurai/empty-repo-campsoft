import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { eq, and, sql } from "drizzle-orm";
import { OrderPayments } from "@core/interfaces/repositories/order";
import {
  orderPayment,
  orderPaymentMethod,
  orderPaymentStatus,
  order,
  clientCards,
} from "@core/models";
import { enrichPaymentOrder } from "@core/common/functions/enrichPaymentOrder";

@injectable()
export class PaymentListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(orderId: string): Promise<OrderPayments[] | null> {
    const result = await this.db
      .select({
        type_id: orderPayment.id_pedido_pag_metodo,
        type: schema.orderPaymentMethod.pedido_pag_metodo,
        status: schema.orderPaymentStatus.pedido_pagamento_status,
        credit_card: {
          brand: clientCards.brand,
          number:
            sql<string>`CONCAT(COALESCE(${clientCards.first_digits}, ''), '********', COALESCE(${clientCards.last_digits}, ''))`.mapWith(
              String
            ),
          credit_card_id:
            sql<string>`BIN_TO_UUID(${clientCards.card_id})`.mapWith(String),
        },
        voucher: orderPayment.voucher,
        boleto: {
          url: orderPayment.pag_info_adicional,
          code: orderPayment.codigo_pagamento,
          expire_at: orderPayment.data_vencimento,
        },
        pix: {
          url: orderPayment.pag_info_adicional,
          code: orderPayment.codigo_pagamento,
          expire_at: orderPayment.data_vencimento,
        },
        cycle: order.recorrencia_periodo,
        created_at: orderPayment.created_at,
        updated_at: orderPayment.updated_at,
      })
      .from(orderPayment)
      .innerJoin(
        schema.orderPaymentMethod,
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
      .leftJoin(clientCards, eq(clientCards.card_id, orderPayment.card_id))
      .where(and(eq(orderPayment.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (!result.length) {
      return null;
    }

    return enrichPaymentOrder(result);
  }
}
