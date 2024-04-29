import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { BannerItemUpdaterRequestDto } from "./dtos/BannerItemUpdaterRequest.dto";
import { TFunction } from "i18next";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { BannerItemNotFoundError } from "@core/common/exceptions/BannerItemNotFoundError";

@injectable()
export class BannerItemUpdaterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async update(
    t: TFunction<"translation", undefined>,
    companyIds: number[],
    bannerId: number,
    bannerItemId: number,
    bannerBody: BannerItemUpdaterRequestDto,
  ): Promise<boolean> {
    const banner = await this.bannerService.viewByPartner(companyIds, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    const bannerItem = banner?.items.find((item) => item.item_id === bannerItemId);

    if (!bannerItem) {
      throw new BannerItemNotFoundError(t("banner_item_not_found"));
    }

    return this.bannerService.updateItem(bannerId, bannerItemId, bannerBody);
  }
}
