import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";

const { client } = schema;

@injectable()
export class ClientImageUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(clientId: string, storageUrl: string) {
    const result = await this.db
      .update(client)
      .set({
        foto: storageUrl,
      })
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
