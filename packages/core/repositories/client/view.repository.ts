import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client, clientCompany } from "@core/models";
import { eq, sql, and } from "drizzle-orm";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

@injectable()
export class ViewClientRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async view(
    apiAccess: ViewApiResponse,
    userId: string
  ): Promise<ViewClientResponse | null> {
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
      .innerJoin(clientCompany, eq(clientCompany.id_cliente, client.id_cliente))
      .where(
        and(
          eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`),
          eq(clientCompany.id_empresa, apiAccess.company_id)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientResponse;
  }
}
