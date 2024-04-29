import { banner } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { BannerUpdaterRequestDto } from "@core/useCases/banner/dtos/BannerUpdaterRequest.dto";

@injectable()
export class BannerUpdaterRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async update(bannerId: number, input: BannerUpdaterRequestDto) {
    const result = await this.db
      .update(banner)
      .set({
        local: input.location,
        id_banner_tipo: input.type,
        banner: input.banner_name,
      })
      .where(eq(banner.id_banner, bannerId))
      .execute();

    if (!result[0].affectedRows) {
      return false;
    }

    return true;
  }
}
