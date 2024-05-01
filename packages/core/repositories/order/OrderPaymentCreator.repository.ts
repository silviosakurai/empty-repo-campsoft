import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { orderPayment } from "@core/models";
import { sql } from "drizzle-orm";
import {
  ListOrderById,
  OrderPaymentUpdateInput,
} from "@core/interfaces/repositories/order";
import { currentTime } from "@core/common/functions/currentTime";
import {
  OrderPaymentsMethodsEnum,
  OrderStatusEnum,
} from "@core/common/enums/models/order";

@injectable()
export class OrderPaymentCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    order: ListOrderById,
    signatureId: string,
    methodId: OrderPaymentsMethodsEnum,
    statusPayment: OrderStatusEnum,
    input: OrderPaymentUpdateInput
  ): Promise<boolean> {
    const validUntil = currentTime();

    const valuesObject: typeof schema.orderPayment.$inferInsert = {
      id_pedido_pagamento_atrelado:
        sql`UUID_TO_BIN(${order.order_id_previous})` as unknown as string,
      id_pedido: sql`UUID_TO_BIN(${order.order_id})` as unknown as string,
      id_cliente: sql`UUID_TO_BIN(${order.client_id})` as unknown as string,
      id_assinatura_cliente:
        sql`UUID_TO_BIN(${signatureId})` as unknown as string,
      id_pedido_pagamento_status: statusPayment,
      valor_preco: order.total_price,
      valor_desconto: order.total_discount,
      valor_total: order.total_price_with_discount,
      valor_desconto_ordem_anterior: order.total_previous_order_discount_value,
      pedido_parcelas_valor: order.total_installments_value,
      pedido_parcelas_vezes: order.total_installments,
      id_pedido_pag_metodo: Number(methodId),
      data_pagamento: validUntil,
    };

    if (input.paymentTransactionId) {
      valuesObject.pag_trans_id = input.paymentTransactionId;
    }

    if (methodId === OrderPaymentsMethodsEnum.BOLETO) {
      valuesObject.pag_info_adicional = input.paymentLink;
      valuesObject.data_vencimento = input.dueDate;
      valuesObject.codigo_barra = input.barcode;
    }

    if (methodId === OrderPaymentsMethodsEnum.VOUCHER) {
      valuesObject.voucher = input.voucher;
    }

    if (methodId === OrderPaymentsMethodsEnum.CARD) {
      valuesObject.card_id =
        sql`UUID_TO_BIN(${input.cardId})` as unknown as string;
    }

    if (methodId === OrderPaymentsMethodsEnum.PIX) {
      valuesObject.pag_info_adicional = input.paymentLink;
      valuesObject.data_vencimento = input.dueDate;
    }

    const result = await this.db
      .insert(orderPayment)
      .values(valuesObject)
      .execute();

    return result[0].affectedRows > 0;
  }
}
