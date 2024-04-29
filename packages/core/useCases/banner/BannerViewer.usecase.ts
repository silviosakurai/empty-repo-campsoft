import { injectable } from "tsyringe";
import {
  BannerReaderResponseItem,
} from "./dtos/BannerReaderResponse.dto";
import { BannerService } from "@core/services/banner.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";
import { AccessType } from "@core/common/enums/models/access";
import { checkIfCompanyHasAccess } from "@core/common/functions/checkIfCompanyHasAccess";

@injectable()
export class BannerViewerUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async view(
    tokenJwtData: ITokenJwtData,
    bannerId: number
  ): Promise<BannerReaderResponseItem | null> {
    const companyIdsAllowed = checkIfCompanyHasAccess(tokenJwtData.access, AccessType.PRODUCT_MANAGEMENT);

    const banner = await this.bannerService.viewByPartner(companyIdsAllowed, bannerId);

    if (!banner) {
      return null;
    }

    return banner;
  }
}
