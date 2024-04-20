import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client, access } from "@core/models";
import { eq, sql, and } from "drizzle-orm";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ViewClientByIdResponse } from "@core/useCases/client/dtos/ViewClientByIdResponse.dto";
import {
  ClientWithCompaniesResponse,
  ClientWithListCompaniesResponse,
} from "@core/interfaces/repositories/client";

@injectable()
export class ClientViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

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

  async viewById(userId: string): Promise<ViewClientByIdResponse | null> {
    const result = await this.db
      .select({
        user_id: sql`BIN_TO_UUID(${schema.client.id_cliente})`.mapWith(String),
        status: schema.client.status,
        name: schema.client.nome,
        first_name: schema.client.nome,
        last_name: schema.client.sobrenome,
        birthday:
          sql`DATE_FORMAT(${schema.client.data_nascimento}, "%Y-%m-%d")`.mapWith(
            String
          ),
        email: schema.client.email,
        phone: schema.client.telefone,
        cpf: schema.client.cpf,
        gender: schema.client.sexo,
        company_id: schema.company.id_empresa,
        company_name: schema.company.nome_fantasia,
        user_type: schema.access.id_acesso_tipo,
      })
      .from(client)
      .innerJoin(access, eq(access.id_cliente, client.id_cliente))
      .innerJoin(
        schema.company,
        eq(schema.access.id_empresa, schema.company.id_empresa)
      )
      .where(eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`))
      .execute();
    console.log(userId);
    if (!result.length) {
      return null;
    }

    const resultWithCompanies = this.parseCompany(result);
    return resultWithCompanies as unknown as ViewClientByIdResponse;
  }

  private parseCompany(
    clients: ClientWithCompaniesResponse[]
  ): ClientWithListCompaniesResponse {
    const clientParsed = {
      ...clients[0],
      companies: [] as any,
    };

    clients.forEach((client) => {
      clientParsed.companies.push({
        company_id: client.company_id,
        company_name: client.company_name,
        user_type: client.user_type,
        leader_id: "",
      });
    });

    return clientParsed;
  }
}
