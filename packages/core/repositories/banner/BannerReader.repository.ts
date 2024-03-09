import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { banner, bannerItem } from "@core/models/banner";
import { MySql2Database } from "drizzle-orm/mysql2";
import { IBannerReaderInput } from "@core/interfaces/repositories/banner";
import { and, between, count, eq, gte, like, lte, sql } from "drizzle-orm";
import { BannerStatus } from "@core/common/enums/models/banner";

@injectable()
export class BannerReaderRepository {
  private db: MySql2Database<typeof schema>;

  constructor(
    @inject("Database") mySql2Database: MySql2Database<typeof schema>
  ) {
    this.db = mySql2Database;
  }
  async read(input: IBannerReaderInput) {
    const result = await this.db
      .select({
        banner_id: banner.id_banner,
        location: banner.local,
        type: banner.id_banner_tipo,
        banner_name: banner.banner,
        item_id: bannerItem.id_banner_item,
        item_name: bannerItem.banner_item,
        description: bannerItem.descricao,
        sort: bannerItem.ordem,
        format: bannerItem.formato,
        images: {
          desktop: bannerItem.url_img_desk,
          mobile: bannerItem.url_img_mobile,
        },
        html: bannerItem.html,
        link: bannerItem.link,
        start_date: bannerItem.banner_data_in,
        end_date: bannerItem.banner_data_fim,
        count: count(banner.id_banner),
      })
      .from(banner)
      .where(
        and(
          like(banner.local, `%${input.location}%`),
          eq(banner.id_banner_tipo, input.type),
          eq(banner.status, BannerStatus.ACTIVE),
          lte(bannerItem.banner_data_in, new Date()),
          gte(bannerItem.banner_data_fim, new Date())
        )
      )
      .innerJoin(bannerItem, eq(bannerItem.id_banner, banner.id_banner))
      .limit(input.per_page)
      .offset(input.current_page * input.per_page)
      .execute();

    return result;
  }
}
