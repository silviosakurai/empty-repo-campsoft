import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client } from "@core/models";
import { eq, sql } from "drizzle-orm";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";

@injectable()
export class ClientRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async viewClient(userId: string): Promise<ViewClientResponse | null> {
    const result = await this.db
      .select({
        status: client.status,
        first_name: client.nome,
        last_name: client.sobrenome,
        birthday: client.data_nascimento,
        email: client.email,
        phone: client.telefone,
        cpf: client.cpf,
        gender: client.sexo,
        obs: client.obs,
      })
      .from(client)
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientResponse;
  }
}
