import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { TFunction } from "i18next";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { BannerItemNotFoundError } from "@core/common/exceptions/BannerItemNotFoundError";

@injectable()
export class BannerItemDeleterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async delete(
    t: TFunction<"translation", undefined>,
    companyIds: number[],
    bannerId: number,
    bannerItemId: number,
  ): Promise<boolean> {
    const banner = await this.bannerService.viewByPartner(companyIds, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    const bannerItem = banner?.items.find((item) => item.item_id === bannerItemId);

    if (!bannerItem) {
      throw new BannerItemNotFoundError(t("banner_item_not_found"));
    }

    return this.bannerService.deleteItem(bannerId, bannerItemId);
  }
}
