import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { partner } from "@core/models";
import { SQLWrapper, and, eq } from "drizzle-orm";
import { ListPartnerRequest } from "@core/useCases/partner/dtos/ListPartnerRequest.dto";
import { setPaginationData } from "@core/common/functions/createPaginationData";
import { PartnerResponse } from "@core/useCases/partner/dtos/PartnerResponse.dto";
import { ListPartnerResponse } from "@core/useCases/partner/dtos/ListPartnerResponse.dto";

@injectable()
export class PartnerListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    query: ListPartnerRequest,
  ): Promise<ListPartnerResponse | null> {
    const filters = this.setFilters(query);

    const allQuery = this.db
      .select({
        id_company: partner.id_parceiro,
        id_company_type: partner.id_parceiro_tipo,
        status: partner.status,
        trade_name: partner.nome_fantasia,
        legal_name: partner.razao_social,
        responsible_name: partner.nome_responsavel,
        responsible_lastname: partner.sobrenome_responsavel,
        responsible_email: partner.email_responsavel,
        phone: partner.telefone,
        cnpj: partner.cnpj,
        obs: partner.obs,
        created_at: partner.created_at,
        updated_at: partner.updated_at,
      })
      .from(partner)
      .where(and(...filters));

    const totalResult = await allQuery.execute();

    const paginatedQuery = allQuery
      .limit(query.per_page)
      .offset((query.current_page - 1) * query.per_page);
    const totalPaginated = await paginatedQuery.execute();

    if (!totalPaginated.length) {
      return null;
    }

    const paging = setPaginationData(
      totalPaginated.length,
      totalResult.length,
      query.per_page,
      query.current_page
    );

    return {
      paging,
      results: totalPaginated as unknown as PartnerResponse[],
    };
  }

  private setFilters(query: ListPartnerRequest): SQLWrapper[] {
    const filters: SQLWrapper[] = [];

    if (query.id) {
      filters.push(eq(partner.id_parceiro, query.id));
    }

    if (query.id_partner_type) {
      filters.push(eq(partner.id_parceiro_tipo, query.id_partner_type));
    }

    if (query.status) {
      filters.push(eq(partner.status, query.status));
    }

    if (query.trade_name) {
      filters.push(eq(partner.nome_fantasia, query.trade_name));
    }

    if (query.legal_name) {
      filters.push(eq(partner.razao_social, query.legal_name));
    }

    if (query.cnpj) {
      filters.push(eq(partner.cnpj, query.cnpj));
    }

    return filters;
  }
}
