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
      .from(schema.client)
      .innerJoin(
        schema.access,
        eq(
          sql`BIN_TO_UUID(${schema.access.id_cliente})`,
          sql`BIN_TO_UUID(${schema.client.id_cliente})`
        )
      )
      .innerJoin(
        schema.company,
        eq(schema.company.id_empresa, schema.access.id_empresa)
      )
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
        filters.push(eq(schema.client.cpf, query.cpf));
      }

      if (query.name) {
        filters.push(eq(schema.client.nome, query.name));
      }

      if (query.email) {
        filters.push(eq(schema.client.email, query.email));
      }

      return filters;
    }

    filters.push(eq(schema.company.id_empresa, companyId));

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
        user_type: client.user_type,
        leader_id: "",
      });

      delete clientsParsed[client.user_id as string].company_id;
      delete clientsParsed[client.user_id as string].company_name;
      delete clientsParsed[client.user_id as string].user_type;
    });

    return Object.values(clientsParsed);
  }
}
