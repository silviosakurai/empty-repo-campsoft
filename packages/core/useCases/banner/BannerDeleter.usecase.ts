import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";

@injectable()
export class BannerDeleterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async delete(
    bannerId: number,
  ): Promise<boolean> {
    return this.bannerService.delete(bannerId);
  }
}
