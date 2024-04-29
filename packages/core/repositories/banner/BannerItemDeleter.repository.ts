import { bannerItem } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import { BannerItemStatus } from "@core/common/enums/models/banner";

@injectable()
export class BannerItemDeleterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async delete(
    bannerId: number,
    bannerItemId: number,
  ) {
    const result = await this.db
      .update(bannerItem)
      .set({
        status: BannerItemStatus.INACTIVE,
      })
      .where(
        and(
          eq(bannerItem.id_banner, bannerId),
          eq(bannerItem.id_banner_item, bannerItemId),
        )
      )
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
