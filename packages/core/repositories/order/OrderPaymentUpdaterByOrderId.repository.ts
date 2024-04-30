import { orderPayment } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { eq, sql } from "drizzle-orm";
import { OrderPaymentUpdateInput } from "@core/interfaces/repositories/order";

@injectable()
export class OrderPaymentUpdaterByOrderIdRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(orderId: string, input: OrderPaymentUpdateInput) {
    const result = await this.db
      .update(orderPayment)
      .set({
        pag_trans_id: input.paymentTransactionId,
        pag_info_adicional: input.paymentLink,
        due_date: input.dueDate,
        codigo_barra: input.barcode,
      })
      .where(eq(orderPayment.id_pedido, sql`UUID_TO_BIN(${orderId})`))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
