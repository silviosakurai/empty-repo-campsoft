import * as schema from "@core/models";
import { fiZoopSeller } from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

@injectable()
export class PaymentSellerViewerByEmailRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(email: string) {
    const result = await this.db
      .select({
        sellerId: fiZoopSeller.id_fi_zoop_vendedor,
      })
      .from(fiZoopSeller)
      .where(eq(fiZoopSeller.business_email, email));

    if (!result.length) return null;

    return result[0];
  }
}
