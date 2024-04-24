import { setPaginationData } from "@core/common/functions/createPaginationData";
import {
  ClientListResponse,
  ClientWithCompaniesListResponse,
} from "@core/interfaces/repositories/client";
import * as schema from "@core/models";
import { ListClientRequest } from "@core/useCases/client/dtos/ListClientRequest.dto";
import {
  ListClientGroupedByCompany,
  ListClienttGroupedByCompanyResponse,
} from "@core/useCases/client/dtos/ListClientResponse.dto";
import { eq, sql, and, SQLWrapper } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client, order, partner } from "@core/models";

@injectable()
export class ClientListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listWithCompanies(
    companyId: number,
    query: ListClientRequest
  ): Promise<ListClienttGroupedByCompanyResponse | null> {
    const filters = this.setFilters(query, companyId);

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
        company_id: partner.id_parceiro,
        company_name: partner.nome_fantasia,
      })
      .from(client)
      .innerJoin(order, eq(order.id_cliente, client.id_cliente))
      .innerJoin(partner, eq(partner.id_parceiro, order.id_parceiro))
      .where(and(...filters))
      .groupBy();

    const paginatedQuery = allQuery
      .limit(query.per_page)
      .offset((query.current_page - 1) * query.per_page);

    const totalPaginated = await paginatedQuery.execute();

    if (!totalPaginated.length) {
      return null;
    }

    const bodyWithCompany = this.parseCompany(totalPaginated);

    const paging = setPaginationData(
      bodyWithCompany.length,
      bodyWithCompany.length,
      query.per_page,
      query.current_page
    );

    return {
      paging,
      results: bodyWithCompany as unknown as ListClientGroupedByCompany[],
    };
  }

  private setFilters(
    query: ListClientRequest,
    companyId: number
  ): SQLWrapper[] {
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

    filters.push(eq(partner.id_parceiro, companyId));

    return filters;
  }

  private parseCompany(
    clients: ClientListResponse[]
  ): ClientWithCompaniesListResponse[] {
    const clientsParsed: any = {};

    clients.forEach((client) => {
      if (!clientsParsed[client.user_id as string]) {
        clientsParsed[client.user_id as string] = {
          ...client,
          companies: [] as any,
        };
      }
      clientsParsed[client?.user_id as string].companies.push({
        company_id: client.company_id,
        company_name: client.company_name,
        leader_id: "",
      });

      delete clientsParsed[client.user_id as string].company_id;
      delete clientsParsed[client.user_id as string].company_name;
    });

    return Object.values(clientsParsed);
  }
}
