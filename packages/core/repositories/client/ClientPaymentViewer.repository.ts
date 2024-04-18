import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientPayment } from "@core/models";
import { eq, sql } from "drizzle-orm";

@injectable()
export class ClientPaymentViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(clientId: string) {
    const result = await this.db
      .select({
        client_id: clientPayment.id_cliente,
        external_id: clientPayment.id_cliente_externo,
      })
      .from(clientPayment)
      .where(eq(clientPayment.id_cliente, sql`UUID_TO_BIN(${clientId})`))
      .execute();

    if (!result.length) {
      return false;
    }

    return result[0];
  }
}
