import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { order } from "@core/models/order/order.model";
import { eq, sql } from "drizzle-orm";

@injectable()
export class FindOrderByNumberRepository {
  constructor(@inject("Database") private db: MySql2Database<typeof schema>) {}

  async find(orderNumber: string) {
    const record = await this.db
      .select({
        order_id: sql`BIN_TO_UUID(${order.id_pedido})`,
      })
      .from(order)
      .where(eq(order.id_pedido, sql`UUID_TO_BIN(${orderNumber})`));

    return record;
  }
}
