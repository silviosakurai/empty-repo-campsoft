import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { IClientConnectClientAndCompany } from "@core/interfaces/services/IClient.service";
import { sql } from "drizzle-orm";
import { IAccessCreate } from "@core/interfaces/repositories/IAccess.repository";

@injectable()
export class AccessCreator {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async create(input: IAccessCreate): Promise<boolean> {
    const result = await this.db
      .insert(schema.access)
      .values({
        id_cliente: sql`UUID_TO_BIN(${input.clientId})`,
        id_acesso_tipo: input.accessTypeId,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
