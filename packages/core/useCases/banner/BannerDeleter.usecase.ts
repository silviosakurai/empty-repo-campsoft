import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { TFunction } from "i18next";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";
import { AccessType } from "@core/common/enums/models/access";
import { BannerNotFoundError } from "@core/common/exceptions/BannerNotFoundError";

@injectable()
export class BannerDeleterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async delete(
    t: TFunction<"translation", undefined>,
    tokenJwtData: ITokenJwtData,
    bannerId: number,
  ): Promise<boolean> {
    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT);

    const banner = await this.bannerService.viewByPartner(companyIdsAllowed, bannerId);

    if (!banner) {
      throw new BannerNotFoundError(t("banner_not_found"));
    }

    return this.bannerService.delete(bannerId);
  }
}
