import * as schema from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { inject, injectable } from "tsyringe";
import { clientCompanyData } from "@core/models";
import { eq, sql } from "drizzle-orm";

@injectable()
export class CompanyListerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async list(
    clientId: string,
  ): Promise<number[] | null> {
    const result = await this.db
      .select({
        company_id: clientCompanyData.id_empresa,
      })
      .from(clientCompanyData)
      .where(
        eq(clientCompanyData.id_cliente, sql`UUID_TO_BIN(${clientId})`)
      )
      .execute();

    if (!result.length) {
      return null;
    }

    const companyIds = result.map((company) => company.company_id);

    return companyIds;
  }
}
