import { injectable } from "tsyringe";
import { BannerReaderRequestDto } from "./dtos/BannerReaderRequest.dto";
import {
  BannerReaderResponseDto,
  BannerReaderResponseItem,
} from "./dtos/BannerReaderResponse.dto";
import { BannerService } from "@core/services/banner.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class BannerReaderUseCase {
  private bannerService: BannerService;

  constructor(bannerService: BannerService) {
    this.bannerService = bannerService;
  }

  async read(
    tokenKeyData: ITokenKeyData,
    input: BannerReaderRequestDto
  ): Promise<BannerReaderResponseDto | null> {
    const bannersResult = await this.bannerService.banners(tokenKeyData, input);
    const count = await this.bannerService.countTotal(tokenKeyData, input);

    if (!bannersResult.length) {
      return this.emptyResult(input);
    }

    const totalPages = Math.ceil(count / input.per_page);

    return {
      paging: {
        total: count,
        current_page: input.current_page,
        per_page: input.per_page,
        count: bannersResult.length,
        total_pages: totalPages,
      },
      results: bannersResult as BannerReaderResponseItem[],
    };
  }

  private emptyResult(input: BannerReaderRequestDto) {
    return {
      paging: {
        total: 0,
        current_page: input.current_page,
        per_page: input.per_page,
        count: 0,
        total_pages: 0,
      },
      results: [],
    };
  }
}
