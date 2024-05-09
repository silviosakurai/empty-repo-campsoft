import { partner } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { PartnerStatus } from "@core/common/enums/models/partner";

@injectable()
export class PartnerDeleterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async delete(partnerId: number) {
    const result = await this.db
      .update(partner)
      .set({
        status: PartnerStatus.INACTIVE,
      })
      .where(eq(partner.id_parceiro, partnerId))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
