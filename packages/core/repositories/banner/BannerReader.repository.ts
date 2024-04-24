import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { banner, bannerItem } from "@core/models/banner";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  IBanner,
  IBannerItem,
  IBannerReaderInput,
} from "@core/interfaces/repositories/banner";
import { and, count, eq, gte, lte } from "drizzle-orm";
import {
  BannerItemStatus,
  BannerStatus,
} from "@core/common/enums/models/banner";
import { currentTime } from "@core/common/functions/currentTime";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class BannerReaderRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  private buildWhereCondition(
    tokenKeyData: ITokenKeyData,
    input: IBannerReaderInput
  ) {
    let whereCondition = and(
      eq(banner.status, BannerStatus.ACTIVE),
      eq(banner.id_parceiro, tokenKeyData.id_parceiro)
    );

    if (input.location) {
      whereCondition = and(whereCondition, eq(banner.local, input.location));
    }

    if (input.type) {
      whereCondition = and(
        whereCondition,
        eq(banner.id_banner_tipo, input.type)
      );
    }

    return whereCondition;
  }

  async banners(
    tokenKeyData: ITokenKeyData,
    input: IBannerReaderInput
  ): Promise<IBanner[]> {
    const offset = input.current_page
      ? (input.current_page - 1) * input.per_page
      : 0;

    const whereCondition = this.buildWhereCondition(tokenKeyData, input);

    const result = await this.db
      .select({
        banner_id: banner.id_banner,
        location: banner.local,
        type: banner.id_banner_tipo,
        banner_name: banner.banner,
      })
      .from(banner)
      .where(whereCondition)
      .limit(input.per_page)
      .offset(offset)
      .execute();

    if (!result.length) {
      return [];
    }

    const enrichPromises = await this.enrichBannerItensPromises(result);

    return enrichPromises;
  }

  async bannerItens(bannerId: number): Promise<IBannerItem[]> {
    const timeNow = currentTime();

    const result = await this.db
      .select({
        banner_id: bannerItem.id_banner,
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
      })
      .from(bannerItem)
      .where(
        and(
          eq(bannerItem.id_banner, bannerId),
          eq(bannerItem.status, BannerItemStatus.ACTIVE),
          lte(bannerItem.banner_data_in, timeNow),
          gte(bannerItem.banner_data_fim, timeNow)
        )
      )
      .execute();

    if (!result.length) {
      return [];
    }

    return result as unknown as IBannerItem[];
  }

  async countTotal(
    tokenKeyData: ITokenKeyData,
    input: IBannerReaderInput
  ): Promise<number> {
    const whereCondition = this.buildWhereCondition(tokenKeyData, input);

    const countResult = await this.db
      .select({
        count: count(),
      })
      .from(banner)
      .where(whereCondition)
      .execute();

    return countResult[0].count;
  }

  private async enrichBannerItensPromises(result: IBanner[]) {
    const enrichBannerPromises = result.map(async (banner: IBanner) => ({
      ...banner,
      items: await this.bannerItens(banner.banner_id),
    }));

    const enrichedItens = await Promise.all(enrichBannerPromises);

    return enrichedItens;
  }
}
