import * as schema from "@core/models";
import { productPartner } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { and, eq } from "drizzle-orm";

@injectable()
export class ProductPartnerDeleterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async delete(productId: string, partnerId: number): Promise<boolean> {
    const result = await this.db
      .delete(productPartner)
      .where(
        and(
          eq(productPartner.id_parceiro, partnerId),
          eq(productPartner.id_produto, productId)
        )
      )
      .execute();
    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
