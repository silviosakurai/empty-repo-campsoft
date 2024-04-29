import { injectable } from "tsyringe";
import { BannerService } from "@core/services/banner.service";
import { BannerCreatorRequestDto } from "./dtos/BannerCreatorRequest.dto";

@injectable()
export class BannerCreatorUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async create(
    bannerBody: BannerCreatorRequestDto,
  ): Promise<boolean> {
    return this.bannerService.create(bannerBody);
  }
}
