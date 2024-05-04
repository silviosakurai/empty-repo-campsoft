import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { BannerItemCreatorRequest } from "./dtos/BannerItemCreatorRequest.dto";

@injectable()
export class BannerItemCreatorUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async create(
    bannerId: number,
    bannerBody: BannerItemCreatorRequest,
  ): Promise<boolean> {
    return this.bannerService.createItem(bannerId, bannerBody);
  }
}
