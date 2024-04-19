import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";

@injectable()
export class BannerItemDeleterUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async delete(
    bannerId: number,
    bannerItemId: number,
  ): Promise<boolean> {
    return this.bannerService.deleteItem(bannerId, bannerItemId);
  }
}
