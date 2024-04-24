import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { clientPayment } from "@core/models";
import { sql } from "drizzle-orm";

@injectable()
export class ClientPaymentCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(clientId: string, clientExternalId: string) {
    const result = await this.db
      .insert(clientPayment)
      .values({
        id_cliente: sql`UUID_TO_BIN(${clientId})`,
        id_cliente_externo: clientExternalId,
      })
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
