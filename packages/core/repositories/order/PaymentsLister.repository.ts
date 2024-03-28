import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { eq, and, sql } from "drizzle-orm";
import { OrderPaymentsMethodsEnum } from "@core/common/enums/models/order";
import { OrderPayments } from "@core/interfaces/repositories/order";
import {
  orderPayment,
  orderPaymentMethod,
  orderPaymentStatus,
} from "@core/models";

@injectable()
export class PaymentListerRepository {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async list(orderId: string): Promise<OrderPayments[] | null> {
    const result = await this.db
      .select({
        type: schema.orderPaymentMethod.pedido_pag_metodo,
        status: schema.orderPaymentStatus.pedido_pagamento_status,
        credit_card: {
          brand: orderPayment.pag_cc_tipo,
          number: orderPayment.pag_cc_numero_cartao,
          credit_card_id: orderPayment.pag_cc_instantbuykey,
        },
        voucher: orderPayment.pag_hash,
        boleto: {
          url: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.BOLETO} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.url'), NULL)
            ELSE NULL
          END`,
          code: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.BOLETO} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.line'), NULL)
            ELSE NULL
          END`,
        },
        pix: {
          url: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.PIX} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.qr_code_url'), NULL)
            ELSE NULL
          END`,
          code: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.PIX} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.qr_code'), NULL)
            ELSE NULL
          END`,
          expire_at: sql<string>`CASE WHEN ${orderPayment.id_pedido_pag_metodo} = ${OrderPaymentsMethodsEnum.PIX} 
            THEN COALESCE(JSON_EXTRACT(${orderPayment.pag_info_adicional},'$.expires_at'), NULL)
            ELSE NULL
          END`,
        },
        cycle: orderPayment.assinatura_ciclo,
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
      .where(and(eq(orderPayment.id_pedido, sql`UUID_TO_BIN(${orderId})`)))
      .execute();

    if (!result.length) {
      return null;
    }

    return result as OrderPayments[];
  }
}
