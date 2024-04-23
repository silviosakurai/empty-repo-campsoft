import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client } from "@core/models";
import { eq, sql, and, or } from "drizzle-orm";
import { IPasswordRecoveryMethods } from "@core/interfaces/repositories/client";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class ClientPasswordRecoveryMethodsRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async passwordRecoveryMethods(
    tokenKeyData: ITokenKeyData,
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
      .where(
        and(
          and(eq(client.id_parceiro_cadastro, tokenKeyData.id_parceiro)),
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
