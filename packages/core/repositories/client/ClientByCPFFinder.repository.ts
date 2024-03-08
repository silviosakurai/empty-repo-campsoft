import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { client } from "@core/models";

@injectable()
export class ClientByCPFFinderRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async find(cpf: string): Promise<{ id_cliente: string } | null> {
    const result = await this.db
      .select({
        id_cliente: sql`BIN_TO_UUID(${client.id_cliente})`,
      })
      .from(client)
      .where(eq(client.cpf, cpf))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as { id_cliente: string };
  }
}