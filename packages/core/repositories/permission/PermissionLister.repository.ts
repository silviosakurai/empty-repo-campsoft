import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { permission, action, roleAction, client, role } from "@core/models";
import { and, eq, sql } from "drizzle-orm";
import { ClientStatus } from "@core/common/enums/models/client";
import { PermissionFindByCliendId } from "@core/interfaces/repositories/permission";

@injectable()
export class PermissionListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async findByCliendId(clientId: string): Promise<PermissionFindByCliendId[]> {
    const result = await this.db
      .select({
        action: action.acao,
        company_id: permission.id_parceiro,
      })
      .from(permission)
      .innerJoin(client, eq(client.id_cliente, permission.id_cliente))
      .innerJoin(role, eq(role.id_cargo, permission.id_cargo))
      .innerJoin(roleAction, eq(roleAction.id_cargo, role.id_cargo))
      .innerJoin(action, eq(action.id_acao, roleAction.id_acao))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`)
        )
      )
      .groupBy(
        action.acao,
        permission.id_grupo,
        permission.id_parceiro,
        permission.id_cargo,
        roleAction.contexto
      )
      .execute();

    if (result.length === 0) {
      return [] as PermissionFindByCliendId[];
    }

    return result as PermissionFindByCliendId[];
  }
}
