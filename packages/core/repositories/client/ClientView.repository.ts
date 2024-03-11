import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client, access } from "@core/models";
import { eq, sql, and } from "drizzle-orm";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ClientViewRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async view(
    tokenKeyData: ITokenKeyData,
    userId: string
  ): Promise<ViewClientResponse | null> {
    const result = await this.db
      .select({
        client_id: sql`BIN_TO_UUID(${client.id_cliente})`,
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
      .innerJoin(access, eq(access.id_cliente, client.id_cliente))
      .where(
        and(
          eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`),
          eq(access.id_empresa, tokenKeyData.company_id)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientResponse;
  }
}
