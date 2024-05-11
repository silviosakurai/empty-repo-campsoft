import { injectable } from "tsyringe";
import { BannerReaderRequestDto } from "./dtos/BannerReaderRequest.dto";
import {
  BannerReaderResponseDto,
  BannerReaderResponseItem,
} from "./dtos/BannerReaderResponse.dto";
import { BannerService } from "@core/services/banner.service";
import { ControlAccessService } from "@core/services/controlAccess.service";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

@injectable()
export class BannerListerUseCase {
  constructor(
    private readonly bannerService: BannerService,
    private readonly controlAccessService: ControlAccessService,
  ) {}

  async list(
    tokenJwtData: ITokenJwtData,
    input: BannerReaderRequestDto
  ): Promise<BannerReaderResponseDto | null> {
    const listPartnersIds =
      this.controlAccessService.listPartnersIds(tokenJwtData);

    const bannersResult = await this.bannerService.listByPartner(listPartnersIds, input);
    const count = await this.bannerService.countTotalByPartner(listPartnersIds, input);

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