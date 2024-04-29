import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { BannerItemUpdaterRequestDto } from "./dtos/BannerItemUpdaterRequest.dto";
import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";
import { AccessType } from "@core/common/enums/models/access";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { BannerItemNotFoundError } from "@core/common/exceptions/BannerItemNotFoundError";

@injectable()
export class BannerItemUpdaterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async update(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    bannerId: number,
    bannerItemId: number,
    bannerBody: BannerItemUpdaterRequestDto,
  ): Promise<boolean> {
    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT);

    const banner = await this.bannerService.viewByPartner(companyIdsAllowed, bannerId);

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
