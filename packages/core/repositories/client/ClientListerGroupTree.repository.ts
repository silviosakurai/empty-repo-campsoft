import * as schema from "@core/models";
import { sql, SQL } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { clientGroupsTree } from "@core/models";
import { ListClientByGroupAndPartner } from "@core/interfaces/repositories/client";

@injectable()
export class ClientListerGroupTreeRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listClientByGroupAndPartner(
    whereCondition: SQL<unknown> | undefined
  ): Promise<ListClientByGroupAndPartner[]> {
    const select = await this.db
      .select({
        id_cliente: sql`BIN_TO_UUID(${clientGroupsTree.id_cliente})`.mapWith(
          String
        ),
        id_parceiro: clientGroupsTree.id_parceiro,
      })
      .from(clientGroupsTree)
      .where(whereCondition)
      .execute();

    if (!select.length) {
      return [] as ListClientByGroupAndPartner[];
    }

    return select as ListClientByGroupAndPartner[];
  }
}
