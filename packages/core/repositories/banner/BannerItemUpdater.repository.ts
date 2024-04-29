import { bannerItem } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq, and } from "drizzle-orm";
import { BannerItemUpdaterRequestDto } from "@core/useCases/banner/dtos/BannerItemUpdaterRequest.dto";

@injectable()
export class BannerItemUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(
    bannerId: number,
    bannerItemId: number,
    input: BannerItemUpdaterRequestDto,
  ) {
    const result = await this.db
      .update(bannerItem)
      .set({
        banner_item: input.item_name,
        descricao: input.description,
        ordem: input.sort,
        formato: input.format,
        html: input.html,
        link: input.link,
        banner_data_in: input.start_date,
        banner_data_fim: input.end_date,
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
