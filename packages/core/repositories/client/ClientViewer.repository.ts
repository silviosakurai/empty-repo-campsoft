import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client } from "@core/models";
import { eq, sql, and, SQL } from "drizzle-orm";
import { ViewClientResponse } from "@core/useCases/client/dtos/ViewClientResponse.dto";
import { ViewClientByIdResponse } from "@core/useCases/client/dtos/ViewClientByIdResponse.dto";
import {
  ClientListResponse,
  ClientWithCompaniesListResponse,
} from "@core/interfaces/repositories/client";

@injectable()
export class ClientViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(userId: string): Promise<ViewClientResponse | null> {
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
      .where(and(eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`)))
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewClientResponse;
  }

  async viewById(
    filterClientByPermission: SQL<unknown> | undefined,
    userId: string
  ): Promise<ViewClientByIdResponse | null> {
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
        photo: client.foto,
        obs: client.obs,
      })
      .from(client)
      .leftJoin(schema.order, eq(schema.order.id_cliente, client.id_cliente))
      .where(
        and(
          filterClientByPermission,
          eq(client.id_cliente, sql`UUID_TO_BIN(${userId})`)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    const resultWithCompanies = await this.enrichCompanyClient(result);
    return resultWithCompanies as unknown as ViewClientByIdResponse;
  }

  private async enrichCompanyClient(
    client: ClientListResponse[]
  ): Promise<ClientWithCompaniesListResponse> {
    const clientWithCompanies = {
      ...client[0],
      sellers: await this.fetchSellersClient(client[0].user_id),
      companies: await this.fetchCompaniesClient(client[0].user_id),
    };

    return clientWithCompanies;
  }

  private async fetchCompaniesClient(clientId: string) {
    const positionsQuery = this.db
      .select({
        company_id: schema.permission.id_parceiro,
        company_name: schema.partner.nome_fantasia,
        position_id: schema.role.id_cargo,
        position_name: schema.role.cargo,
      })
      .from(schema.permission)
      .innerJoin(
        schema.role,
        eq(schema.role.id_cargo, schema.permission.id_cargo)
      )
      .leftJoin(
        schema.partner,
        eq(schema.partner.id_parceiro, schema.permission.id_parceiro)
      )
      .where(eq(schema.permission.id_cliente, sql`UUID_TO_BIN(${clientId})`));

    return positionsQuery;
  }

  private async fetchSellersClient(clientId: string) {
    const companiesQuery = this.db
      .select({
        company_id: schema.partner.id_parceiro,
        company_name: schema.partner.nome_fantasia,
        seller_id: sql`BIN_TO_UUID(${schema.order.id_vendedor})`.mapWith(
          String
        ),
      })
      .from(schema.partner)
      .innerJoin(
        schema.order,
        eq(schema.order.id_parceiro, schema.partner.id_parceiro)
      )
      .where(eq(schema.order.id_cliente, sql`UUID_TO_BIN(${clientId})`));

    return companiesQuery.execute();
  }
}
