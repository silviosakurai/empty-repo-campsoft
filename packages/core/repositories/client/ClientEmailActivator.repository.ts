import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { sql, eq } from "drizzle-orm";
import { clientEmail } from "@core/models/client";
import { ClientEmailVerified } from "@core/common/enums/models/clientEmail";

@injectable()
export class ClientEmailActivatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async activate(token: string) {
    const results = await this.db
      .update(clientEmail)
      .set({
        verificado: ClientEmailVerified.YES,
        verificado_data: new Date().toISOString(),
      })
      .where(eq(clientEmail.token, sql`UUID_TO_BIN(${token})`));

    if (!results[0].affectedRows) {
      return false;
    }

    return true;
  }
}
