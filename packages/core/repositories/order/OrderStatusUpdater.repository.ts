import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { order } from "@core/models";
import { eq, sql } from "drizzle-orm";
import { OrderStatusEnum } from "@core/common/enums/models/order";

@injectable()
export class OrderStatusUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(orderId: string, status: OrderStatusEnum) {
    const [result] = await this.db
      .update(order)
      .set({
        id_pedido_status: status,
      })
      .where(eq(order.id_pedido, sql`UUID_TO_BIN(${orderId})`));

    if (!result.affectedRows) {
      return false;
    }

    return true;
  }
}
