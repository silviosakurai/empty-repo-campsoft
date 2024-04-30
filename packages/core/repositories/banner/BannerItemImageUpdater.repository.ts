import { bannerItem } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import { BannerImageType } from "@core/common/enums/models/banner";

@injectable()
export class BannerItemImageUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(
    bannerId: number,
    bannerItemId: number,
    type: BannerImageType,
    imageUrl: string,
  ) {
    const result = await this.db
      .update(bannerItem)
      .set(this.setBody(type, imageUrl))
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

  private setBody(type: BannerImageType, imageUrl: string) {
    if (type === BannerImageType.desktop) {
      return {
        url_img_desk: imageUrl,
      };
    } else {
      return {
        url_img_mobile: imageUrl,
      };
    }
  }
}
