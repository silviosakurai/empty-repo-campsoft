import * as schema from "@core/models";
import { clientMagicToken } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, and, sql } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import { ClientMagicTokenStatus } from "@core/common/enums/models/client";

@injectable()
export class ClientMagicTokenRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async magicTokenIsUsed(token: string): Promise<boolean> {
    const result = await this.db
      .select({
        client_id: sql`BIN_TO_UUID(${clientMagicToken.id_cliente})`,
      })
      .from(clientMagicToken)
      .where(
        and(
          eq(clientMagicToken.token, token),
          eq(clientMagicToken.status, ClientMagicTokenStatus.YES)
        )
      )
      .execute();

    return result.length === 0;
  }

  async create(clientId: string, token: string): Promise<boolean> {
    const result = await this.db
      .insert(clientMagicToken)
      .values({
        id_cliente: sql`UUID_TO_BIN(${clientId})`,
        token: token,
      })
      .execute();

    return result[0].affectedRows > 0;
  }

  async update(token: string) {
    const result = await this.db
      .update(clientMagicToken)
      .set({
        status: ClientMagicTokenStatus.NO,
      })
      .where(eq(clientMagicToken.token, token))
      .execute();

    return result[0].affectedRows > 0;
  }
}
