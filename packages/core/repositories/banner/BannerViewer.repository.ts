import { injectable, inject } from "tsyringe";
import * as schema from "@core/models";
import { banner, bannerItem } from "@core/models/banner";
import { MySql2Database } from "drizzle-orm/mysql2";
import {
  IBanner,
  IBannerItem,
} from "@core/interfaces/repositories/banner";
import { and, eq, gte, lte, inArray } from "drizzle-orm";
import {
  BannerItemStatus,
  BannerStatus,
} from "@core/common/enums/models/banner";
import { currentTime } from "@core/common/functions/currentTime";
import { BannerReaderResponseItem } from "@core/useCases/banner/dtos/BannerReaderResponse.dto";

@injectable()
export class BannerViewerRepository {
  constructor(
    @inject("Database") private readonly db: MySql2Database<typeof schema>
  ) {}

  async view(
    partnerIds: number[],
    bannerId: number,
  ): Promise<BannerReaderResponseItem | null> {
    const result = await this.db
      .select({
        banner_id: banner.id_banner,
        location: banner.local,
        type: banner.id_banner_tipo,
        banner_name: banner.banner,
      })
      .from(banner)
      .where(and(
        eq(banner.status, BannerStatus.ACTIVE),
        inArray(banner.id_parceiro, partnerIds),
        eq(banner.id_banner, bannerId),
      ))
      .execute();

    if (!result.length) {
      return null;
    }

    const enrichedPromise = await this.enrichBannerItensPromise(result[0]);

    return enrichedPromise as BannerReaderResponseItem;
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

  private async enrichBannerItensPromise(banner: IBanner) {
    const enrichedBanner = {
      ...banner,
      items: await this.bannerItens(banner.banner_id),
    }

    return enrichedBanner;
  }
}
