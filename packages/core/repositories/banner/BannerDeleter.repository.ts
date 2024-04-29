import { banner } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { BannerStatus } from "@core/common/enums/models/banner";

@injectable()
export class BannerDeleterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async delete(bannerId: number) {
    const result = await this.db
      .update(banner)
      .set({
        status: BannerStatus.INACTIVE,
      })
      .where(eq(banner.id_banner, bannerId))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
