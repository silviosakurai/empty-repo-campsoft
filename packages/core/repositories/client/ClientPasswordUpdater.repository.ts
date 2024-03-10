import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { ViewApiTfaResponse } from "@core/useCases/api/dtos/ViewApiTfaResponse.dto";

const { client } = schema;

@injectable()
export class ClientPasswordUpdaterRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async update(tfaInfo: ViewApiTfaResponse, newPass: string) {
    console.log("tfaInfo", tfaInfo);
    console.log("newPass", newPass);

    const result = await this.db
      .update(client)
      .set({
        senha: newPass,
      })
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${tfaInfo.clientId})`))
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return true;
  }
}
