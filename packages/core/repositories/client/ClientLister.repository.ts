import * as schema from "@core/models";
import { ListClientRequest } from "@core/useCases/client/dtos/ListClientRequest.dto";
import { eq, sql, and, SQLWrapper, SQL, or, count } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client, order, partner } from "@core/models";
import {
  ClientResponse,
  ListWithCompanies,
} from "@core/useCases/client/dtos/ClientResponse.dto";

@injectable()
export class ClientListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listWithCompanies(
    filterClientByPermission: SQL<unknown> | undefined,
    query: ListClientRequest
  ): Promise<ClientResponse[] | null> {
    const filters = this.setFilters(query);

    const allQuery = this.db
      .select({
        user_id: sql`BIN_TO_UUID(${client.id_cliente})`.mapWith(String),
        status: client.status,
        name: client.nome,
        first_name: client.nome,
        last_name: client.sobrenome,
        birthday:
          sql`DATE_FORMAT(${client.data_nascimento}, "%Y-%m-%d")`.mapWith(
            String
          ),
        email: client.email,
        phone: client.telefone,
        cpf: client.cpf,
        gender: client.sexo,
        photo: client.foto,
        obs: client.obs,
      })
      .from(client)
      .leftJoin(order, eq(order.id_cliente, client.id_cliente))
      .innerJoin(
        partner,
        or(
          eq(partner.id_parceiro, order.id_parceiro),
          eq(partner.id_parceiro, client.id_parceiro_cadastro)
        )
      )
      .where(and(...filters, filterClientByPermission))
      .groupBy();

    const paginatedQuery = allQuery
      .limit(query.per_page)
      .offset((query.current_page - 1) * query.per_page);

    const totalPaginated = await paginatedQuery.execute();

    if (!totalPaginated.length) {
      return null;
    }

    return await this.enrichCompanyClient(totalPaginated);
  }

  async countTotalClientWithCompanies(
    filterClientByPermission: SQL<unknown> | undefined,
    query: ListClientRequest
  ): Promise<number> {
    const filters = this.setFilters(query);

    const countResult = await this.db
      .select({
        count: count(),
      })
      .from(client)
      .leftJoin(order, eq(order.id_cliente, client.id_cliente))
      .where(and(...filters, filterClientByPermission))
      .execute();

    return countResult[0].count;
  }

  private async enrichCompanyClient(result: ListWithCompanies[]) {
    const enrichCompanyPromises = result.map(
      async (client: ListWithCompanies) => ({
        ...client,
        companies: await this.fetchCompanyClient(client.user_id),
      })
    );

    const enrichCompanyAll = await Promise.all(enrichCompanyPromises);

    return enrichCompanyAll;
  }

  private async fetchCompanyClient(clientId: string) {
    const companiesQuery = this.db
      .select({
        company_id: partner.id_parceiro,
        company_name: partner.nome_fantasia,
        seller_id: sql`BIN_TO_UUID(${order.id_vendedor})`.mapWith(String),
      })
      .from(partner)
      .innerJoin(order, eq(order.id_parceiro, partner.id_parceiro))
      .where(eq(order.id_cliente, sql`UUID_TO_BIN(${clientId})`));

    return companiesQuery.execute();
  }

  private setFilters(query: ListClientRequest): SQLWrapper[] {
    const filters: SQLWrapper[] = [];

    if (query.cpf || query.name || query.email) {
      if (query.cpf) {
        filters.push(eq(client.cpf, query.cpf));
      }

      if (query.name) {
        filters.push(eq(client.nome, query.name));
      }

      if (query.email) {
        filters.push(eq(client.email, query.email));
      }

      return filters;
    }

    return filters;
  }
}
