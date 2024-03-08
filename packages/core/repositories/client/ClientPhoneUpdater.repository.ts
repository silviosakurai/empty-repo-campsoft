import { inject, injectable } from "tsyringe";
import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, sql } from "drizzle-orm";
import { UpdatePhoneClientRequestDto } from "@core/useCases/client/dtos/UpdatePhoneClientRequest.dto";

const { client } = schema;

@injectable()
export class ClientPhoneUpdaterRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async update(clientId: string, input: UpdatePhoneClientRequestDto) {
    const result = await this.db
      .update(client)
      .set({
        telefone: input.phone,
      })
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`))
      .execute();

    if (!result[0].affectedRows) {
      return null;
    }

    return true;
  }
}