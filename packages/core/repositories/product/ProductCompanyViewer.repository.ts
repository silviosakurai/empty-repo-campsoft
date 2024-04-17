import * as schema from "@core/models";
import { productCompany } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";

@injectable()
export class ProductCompanyViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(productId: string, companyId: number) {
    const results = await this.db
      .select({
        productId: productCompany.id_produto,
        companyId: productCompany.id_empresa,
      })
      .from(productCompany)
      .where(
        and(
          eq(productCompany.id_produto, productId),
          eq(productCompany.id_empresa, companyId)
        )
      )
      .execute();

    if (!results.length) {
      return false;
    }

    return results;
  }
}
