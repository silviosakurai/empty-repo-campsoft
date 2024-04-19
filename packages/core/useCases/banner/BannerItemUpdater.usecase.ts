import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { BannerItemUpdaterRequestDto } from "./dtos/BannerItemUpdaterRequest.dto";

@injectable()
export class BannerItemUpdaterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async update(
    bannerId: number,
    bannerItemId: number,
    bannerBody: BannerItemUpdaterRequestDto,
  ): Promise<boolean> {
    return this.bannerService.updateItem(bannerId, bannerItemId, bannerBody);
  }
}
