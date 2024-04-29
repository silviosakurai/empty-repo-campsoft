import { banner } from "@core/models";
import * as schema from "@core/models";
import { inject, injectable } from "tsyringe";
import { MySql2Database } from "drizzle-orm/mysql2";
import { BannerCreatorRequestDto } from "@core/useCases/banner/dtos/BannerCreatorRequest.dto";

@injectable()
export class BannerCreatorRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async create(input: BannerCreatorRequestDto):  Promise<boolean> {
    const result = await this.db
      .insert(banner)
      .values({
        local: input.location,
        id_parceiro: input.business_id,
        id_banner_tipo: input.type,
        banner: input.banner_name,
      })
      .execute();

    if (!result.length) {
      return false;
    }

    return true;
  }
}
