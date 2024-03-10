import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";

const { client } = schema;

@injectable()
export class ClientPasswordUpdaterRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async update(tokenTfaData: ITokenTfaData, newPass: string) {
    const result = await this.db
      .update(client)
      .set({
        senha: newPass,
      })
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${tokenTfaData.clientId})`))
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return true;
  }
}
