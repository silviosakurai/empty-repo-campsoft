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
import type { IClientByCPF } from "@core/interfaces/repositories/client/IClientByCPF.interface";
import { inject, injectable } from "tsyringe";
import { Status } from "@core/common/enums/models/client";
import { LoginResponse } from "@core/useCases/auth/dtos/LoginResponse.dto";

@injectable()
export class ClientRepository {
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
        id_cliente: sql`BIN_TO_UUID(${client.id_cliente}) AS id_cliente`,
        status: client.status,
        id_cliente_tipo: client.id_cliente_tipo,
        nome: client.nome,
        sobrenome: client.sobrenome,
        data_nascimento: client.data_nascimento,
        email: client.email,
        telefone: client.telefone,
        cpf: client.cpf,
        sexo: client.sexo,
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
          eq(client.status, Status.ACTIVE),
          or(
            eq(client.email, login),
            eq(client.cpf, login),
            eq(client.telefone, login)
          ),
          sql`SUBSTRING_INDEX(${client.senha}, ':', 1) = MD5(CONCAT(SUBSTRING_INDEX(${client.senha}, ':', -1), ${password}))`
        )
      )
      .execute();

    return result.length > 0 ? (result[0] as unknown as LoginResponse) : null;
  };
}
