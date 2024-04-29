import { injectable } from "tsyringe";
import {
  BannerReaderResponseItem,
} from "./dtos/BannerReaderResponse.dto";
import { BannerService } from "@core/services/banner.service";

@injectable()
export class BannerViewerUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async view(
    companyIds: number[],
    bannerId: number
  ): Promise<BannerReaderResponseItem | null> {
    const banner = await this.bannerService.viewByPartner(companyIds, bannerId);

    if (!banner) {
      return null;
    }

    return banner;
  }
}
