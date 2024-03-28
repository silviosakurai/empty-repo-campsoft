import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { sql } from "drizzle-orm";
import { IAccessCreate } from "@core/interfaces/repositories/access";

@injectable()
export class AccessCreator {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: IAccessCreate): Promise<boolean> {
    const result = await this.db
      .insert(schema.access)
      .values({
        id_cliente: sql`UUID_TO_BIN(${input.clientId})`,
        id_acesso_tipo: input.accessTypeId,
        id_empresa: input.companyId,
        status: input.status,
        id_api_acesso: input.apiAccessId,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
