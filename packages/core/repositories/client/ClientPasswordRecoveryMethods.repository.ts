import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client, access } from "@core/models";
import { eq, sql, and, or } from "drizzle-orm";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { IPasswordRecoveryMethods } from "@core/interfaces/repositories/client";

@injectable()
export class ClientPasswordRecoveryMethodsRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async passwordRecoveryMethods(
    apiAccess: ViewApiResponse,
    login: string
  ): Promise<IPasswordRecoveryMethods | null> {
    const result = await this.db
      .select({
        clientId: sql`BIN_TO_UUID(${client.id_cliente})`,
        name: client.nome,
        profileImage: client.foto,
        email: client.email,
        phone: client.telefone,
      })
      .from(client)
      .innerJoin(access, eq(access.id_cliente, client.id_cliente))
      .where(
        and(
          and(eq(access.id_empresa, apiAccess.company_id)),
          or(
            eq(client.cpf, login),
            eq(client.email, login),
            eq(client.telefone, login)
          )
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as IPasswordRecoveryMethods;
  }
}
