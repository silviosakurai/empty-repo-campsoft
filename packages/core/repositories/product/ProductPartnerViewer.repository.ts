
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { productPartner } from "@core/models";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";

@injectable()
export class ProductPartnerViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(productId: string, partnerId: number) {
    const results = await this.db
      .select({
        partnerId: productPartner.id_parceiro,
        productId: productPartner.id_produto,
      })
      .from(productPartner)
      .where(
        and(
          eq(productPartner.id_parceiro, partnerId),
          eq(productPartner.id_produto, productId)
        )
      )
      .execute();

    if (!results.length) {
      return false;
    }

    return results[0];
  }
}
