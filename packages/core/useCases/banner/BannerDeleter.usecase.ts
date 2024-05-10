import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { TFunction } from "i18next";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class BannerDeleterUseCase {
  constructor(
    private readonly bannerService: BannerService,
    private readonly controlAccessService: ControlAccessService,
  ) {}

  async delete(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    bannerId: number,
  ): Promise<boolean> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    const banner = await this.bannerService.viewByPartner(listPartnersIds, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    return this.bannerService.delete(bannerId);
  }
}
