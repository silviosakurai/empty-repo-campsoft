import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { permission } from "@core/models";
import { sql } from "drizzle-orm";
import { Role } from "@core/common/enums/models/role";

@injectable()
export class PermissionCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(cliendId: string): Promise<boolean> {
    const result = await this.db
      .insert(permission)
      .values({
        id_cliente: sql`UUID_TO_BIN(${cliendId})`,
        id_cargo: Role.SALES_SITE,
      })
      .execute();

    return !!result[0].affectedRows;
  }
}
