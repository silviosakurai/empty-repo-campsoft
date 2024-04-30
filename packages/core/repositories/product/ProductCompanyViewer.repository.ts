import * as schema from "@core/models";
import { productPartner } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";
import { inArray } from "drizzle-orm";

@injectable()
export class ProductCompanyViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(productId: string, listPartnersIds: number[]) {
    const results = await this.db
      .select({
        productId: productPartner.id_produto,
        companyId: productPartner.id_parceiro,
      })
      .from(productPartner)
      .where(
        and(
          eq(productPartner.id_produto, productId),
          inArray(productPartner.id_parceiro, listPartnersIds)
        )
      )
      .execute();

    if (!results.length) {
      return false;
    }

    return results;
  }
}
