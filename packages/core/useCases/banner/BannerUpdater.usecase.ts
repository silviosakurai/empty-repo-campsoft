import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { BannerUpdaterRequestDto } from "./dtos/BannerUpdaterRequest.dto";

@injectable()
export class BannerUpdaterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async update(
    bannerId: number,
    bannerBody: BannerUpdaterRequestDto,
  ): Promise<boolean> {
    return this.bannerService.update(bannerId, bannerBody);
  }
}
