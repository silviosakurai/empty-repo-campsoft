import { bannerItem } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { BannerItemCreatorRequest } from "@core/useCases/banner/dtos/BannerItemCreatorRequest.dto";

@injectable()
export class BannerItemCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(
    bannerId: number,
    input: BannerItemCreatorRequest,
  ): Promise<boolean> {
    const result = await this.db
      .insert(bannerItem)
      .values({
        id_banner: bannerId,
        banner_item: input.item_name,
        descricao: input.description,
        ordem: input.sort,
        formato: input.format,
        html: input.html,
        link: input.link,
        banner_data_in: input.start_date,
        banner_data_fim: input.end_date,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
