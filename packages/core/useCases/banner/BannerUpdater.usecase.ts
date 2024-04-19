import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { BannerUpdaterRequestDto } from "./dtos/BannerUpdaterRequest.dto";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";
import { AccessType } from "@core/common/enums/models/access";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";
import { TFunction } from "i18next";

@injectable()
export class BannerUpdaterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async update(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    bannerId: number,
    bannerBody: BannerUpdaterRequestDto,
  ): Promise<boolean> {
    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT);

    const banner = await this.bannerService.viewByPartner(companyIdsAllowed, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    return this.bannerService.update(bannerId, bannerBody);
  }
}
