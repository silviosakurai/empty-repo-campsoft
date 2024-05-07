import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { orderPayment, order } from "@core/models";
import { eq, sql } from "drizzle-orm";

@injectable()
export class OrderViewerByTransactionIdRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async find(transactionId: string) {
    const records = await this.db
      .select({
        order_id: sql<string>`BIN_TO_UUID(${orderPayment.id_pedido})`,
        previousOrderId: sql<string>`BIN_TO_UUID(${order.id_pedido_anterior})`,
      })
      .from(orderPayment)
      .innerJoin(order, eq(orderPayment.id_pedido, order.id_pedido))
      .where(eq(orderPayment.pag_trans_id, transactionId));

    if (!records.length) return null;

    return records[0];
  }
}
