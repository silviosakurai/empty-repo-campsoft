import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { TFunction } from "i18next";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";

@injectable()
export class BannerDeleterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async delete(
    t: TFunction<"translation", undefined>,
    companyIds: number[],
    bannerId: number,
  ): Promise<boolean> {
    const banner = await this.bannerService.viewByPartner(companyIds, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    return this.bannerService.delete(bannerId);
  }
}
