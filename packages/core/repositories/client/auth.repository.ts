import * as schema from "@core/models";
import {
  client,
  clientType,
  clientAddress,
  clientCompany,
  apiAccess,
} from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, or, and, sql } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import { ClientStatus } from "@core/common/enums/models/client";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";

@injectable()
export class AuthRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  authenticate = async (
    login: string,
    password: string
  ): Promise<LoginResponse | null> => {
    const result = await this.db
      .select({
        client_id: sql`BIN_TO_UUID(${client.id_cliente})`,
        status: client.status,
        client_id_type: client.id_cliente_tipo,
        facebook_id: client.id_facebook,
        name: client.nome,
        surname: client.sobrenome,
        birth_date: client.data_nascimento,
        email: client.email,
        phone: client.telefone,
        cpf: client.cpf,
        gender: client.sexo,
      })
      .from(client)
      .innerJoin(
        clientType,
        eq(clientType.id_cliente_tipo, client.id_cliente_tipo)
      )
      .leftJoin(clientAddress, eq(clientAddress.id_cliente, client.id_cliente))
      .leftJoin(clientCompany, eq(clientCompany.id_cliente, client.id_cliente))
      .leftJoin(apiAccess, eq(apiAccess.id_empresa, clientCompany.id_empresa))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          or(
            eq(client.email, login),
            eq(client.cpf, login),
            eq(client.telefone, login)
          ),
          sql`SUBSTRING_INDEX(${client.senha}, ':', 1) = MD5(CONCAT(SUBSTRING_INDEX(${client.senha}, ':', -1), ${password}))`
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as LoginResponse;
  };
}
