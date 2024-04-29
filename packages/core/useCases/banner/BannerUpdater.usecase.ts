import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { BannerUpdaterRequestDto } from "./dtos/BannerUpdaterRequest.dto";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { TFunction } from "i18next";

@injectable()
export class BannerUpdaterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async update(
    t: TFunction<"translation", undefined>,
    companyIds: number[],
    bannerId: number,
    bannerBody: BannerUpdaterRequestDto,
  ): Promise<boolean> {
    const banner = await this.bannerService.viewByPartner(companyIds, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    return this.bannerService.update(bannerId, bannerBody);
  }
}
