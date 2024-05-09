import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { TFunction } from "i18next";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { BannerItemNotFoundError } from "@core/common/exceptions/BannerItemNotFoundError";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class BannerItemDeleterUseCase {
  constructor(
    private readonly bannerService: BannerService,
    private readonly controlAccessService: ControlAccessService,
  ) {}

  async delete(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    bannerId: number,
    bannerItemId: number,
  ): Promise<boolean> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    const banner = await this.bannerService.viewByPartner(listPartnersIds, bannerId);

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
