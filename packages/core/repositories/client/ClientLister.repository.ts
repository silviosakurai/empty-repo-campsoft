import * as schema from "@core/models";
import { ListClientRequest } from "@core/useCases/client/dtos/ListClientRequest.dto";
import { eq, sql, and, SQL, count, or, is, asc, desc } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { client, order, partner, permission, role } from "@core/models";
import {
  ClientResponse,
  ListWithCompanies,
} from "@core/useCases/client/dtos/ClientResponse.dto";
import { ClientFields } from "@core/common/enums/models/client";
import { SortOrder } from "@core/common/enums/SortOrder";

@injectable()
export class ClientListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async listWithCompanies(
    filterClientByPermission: SQL<unknown> | undefined,
    query: ListClientRequest
  ): Promise<ClientResponse[] | null> {
    const filters = this.setFilters(query, filterClientByPermission);
    const orderByApply = this.setOrderBy(query);

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
      .innerJoin(permission, eq(permission.id_cliente, client.id_cliente))
      .leftJoin(order, eq(order.id_cliente, client.id_cliente))
      .where(filters)
      .orderBy(orderByApply);

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
    const filters = this.setFilters(query, filterClientByPermission);

    const countResult = await this.db
      .select({
        count: count(),
      })
      .from(client)
      .innerJoin(permission, eq(permission.id_cliente, client.id_cliente))
      .leftJoin(order, eq(order.id_cliente, client.id_cliente))
      .where(filters)
      .execute();

    return countResult[0].count;
  }

  private async enrichCompanyClient(result: ListWithCompanies[]) {
    const enrichCompanyPromises = result.map(
      async (client: ListWithCompanies) => ({
        ...client,
        sellers: await this.fetchSellersClient(client.user_id),
        companies: await this.fetchCompaniesClient(client.user_id),
      })
    );

    const enrichCompanyAll = await Promise.all(enrichCompanyPromises);

    return enrichCompanyAll;
  }

  private async fetchSellersClient(clientId: string) {
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

  private async fetchCompaniesClient(clientId: string) {
    const positionsQuery = this.db
      .select({
        company_id: permission.id_parceiro,
        company_name: partner.nome_fantasia,
        position_id: role.id_cargo,
        position_name: role.cargo,
      })
      .from(permission)
      .innerJoin(role, eq(role.id_cargo, permission.id_cargo))
      .leftJoin(partner, eq(partner.id_parceiro, permission.id_parceiro))
      .where(eq(permission.id_cliente, sql`UUID_TO_BIN(${clientId})`));

    return positionsQuery;
  }

  private setOrderBy(query: ListClientRequest): SQL<unknown> {
    let orderBy =
      query.sort_order === SortOrder.ASC
        ? asc(client.created_at)
        : desc(client.created_at);

    if (query.sort_by === ClientFields.company_id) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(permission.id_parceiro)
          : desc(permission.id_parceiro);
    }

    if (query.sort_by === ClientFields.cpf) {
      orderBy =
        query.sort_order === SortOrder.ASC ? asc(client.cpf) : desc(client.cpf);
    }

    if (query.sort_by === ClientFields.email) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(client.email)
          : desc(client.email);
    }

    if (query.sort_by === ClientFields.gender) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(client.sexo)
          : desc(client.sexo);
    }

    if (query.sort_by === ClientFields.name) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(client.nome)
          : desc(client.nome);
    }

    if (query.sort_by === ClientFields.phone) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(client.telefone)
          : desc(client.telefone);
    }

    if (query.sort_by === ClientFields.position_id) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(permission.id_cargo)
          : desc(permission.id_cargo);
    }

    if (query.sort_by === ClientFields.status) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(client.status)
          : desc(client.status);
    }

    if (query.sort_by === ClientFields.user_id) {
      orderBy =
        query.sort_order === SortOrder.ASC
          ? asc(client.id_cliente)
          : desc(client.id_cliente);
    }

    return orderBy;
  }

  private setFilters(
    query: ListClientRequest,
    filterClientByPermission: SQL<unknown> | undefined
  ): SQL<unknown> | undefined {
    let filters = and();
    let isFilterApplied = false;

    if (query.cpf) {
      filters = and(filters, eq(client.cpf, query.cpf));
      isFilterApplied = true;
    }

    if (query.email) {
      filters = and(filters, eq(client.email, query.email));
      isFilterApplied = true;
    }

    if (query.name) {
      filters = and(filters, eq(client.nome, query.name));
      isFilterApplied = true;
    }

    if (query.position_id) {
      filters = isFilterApplied
        ? and(filters, eq(permission.id_cargo, query.position_id))
        : and(
            filterClientByPermission,
            eq(permission.id_cargo, query.position_id)
          );

      isFilterApplied = true;
    }

    if (query.company_id) {
      filters = isFilterApplied
        ? and(filters, eq(permission.id_parceiro, query.company_id))
        : and(
            filterClientByPermission,
            eq(permission.id_parceiro, query.company_id)
          );

      isFilterApplied = true;
    }

    if (query.status) {
      filters = isFilterApplied
        ? and(filters, eq(client.status, query.status))
        : and(filterClientByPermission, eq(client.status, query.status));

      isFilterApplied = true;
    }

    return isFilterApplied ? filters : filterClientByPermission;
  }
}
