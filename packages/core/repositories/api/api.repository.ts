import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { apiAccess, company, clientCompany, client } from "@core/models";
import { and, eq, or, sql } from "drizzle-orm";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { ApiStatus } from "@core/common/enums/models/api";
import { CompanyStatus } from "@core/common/enums/models/company";

@injectable()
export class ApiRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }

  async findApiByKey(keyApi: string): Promise<ViewApiResponse | null> {
    const result = await this.db
      .select({
        api_key: apiAccess.api_chave,
        api_access_id: apiAccess.id_api_acesso,
        status: apiAccess.api_status,
        name: company.nome_fantasia,
        company_id: company.id_empresa,
      })
      .from(apiAccess)
      .innerJoin(company, eq(company.id_api_acesso, apiAccess.id_api_acesso))
      .where(
        and(
          or(
            eq(apiAccess.api_chave, keyApi),
            eq(apiAccess.api_chave_sandbox, keyApi)
          ),
          eq(apiAccess.api_status, ApiStatus.ACTIVE),
          eq(company.status, CompanyStatus.ACTIVE)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewApiResponse;
  }

  async findApiByJwt(clientId: string): Promise<ViewApiResponse | null> {
    const result = await this.db
      .select({
        api_key: apiAccess.api_chave,
        api_access_id: apiAccess.id_api_acesso,
        status: apiAccess.api_status,
        name: company.nome_fantasia,
        company_id: company.id_empresa,
      })
      .from(apiAccess)
      .innerJoin(company, eq(company.id_api_acesso, apiAccess.id_api_acesso))
      .innerJoin(
        clientCompany,
        eq(clientCompany.id_empresa, company.id_empresa)
      )
      .where(
        and(
          eq(apiAccess.api_status, ApiStatus.ACTIVE),
          eq(company.status, CompanyStatus.ACTIVE),
          eq(clientCompany.id_cliente, sql`UUID_TO_BIN(${clientId})`)
        )
      )
      .execute();

    if (!result.length) {
      return null;
    }

    return result[0] as unknown as ViewApiResponse;
  }
}
