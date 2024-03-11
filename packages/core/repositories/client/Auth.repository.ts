import * as schema from "@core/models";
import { access, client, clientType } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, or, and, sql } from "drizzle-orm";
import { inject, injectable } from "tsyringe";
import { ClientStatus } from "@core/common/enums/models/client";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class AuthRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  authenticate = async (
    tokenKeyData: ITokenKeyData,
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
      .innerJoin(access, eq(access.id_cliente, client.id_cliente))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          eq(access.id_empresa, tokenKeyData.company_id),
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

  authenticateByClientId = async (
    tokenKeyData: ITokenKeyData,
    clientId: string,
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
      .innerJoin(access, eq(access.id_cliente, client.id_cliente))
      .where(
        and(
          eq(client.status, ClientStatus.ACTIVE),
          eq(access.id_empresa, tokenKeyData.company_id),
          eq(client.id_cliente, sql`UUID_TO_BIN(${clientId})`),
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
