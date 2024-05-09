import { injectable } from "tsyringe";
import { BannerReaderRequestDto } from "./dtos/BannerReaderRequest.dto";
import { BannerResponseDto } from "./dtos/BannerReaderResponse.dto";
import { BannerService } from "@core/services/banner.service";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";

@injectable()
export class BannerReaderUseCase {
  constructor(private readonly bannerService: BannerService) {}

  async read(
    tokenKeyData: ITokenKeyData,
    input: BannerReaderRequestDto
  ): Promise<BannerResponseDto[] | null> {
    return this.bannerService.list(tokenKeyData, input);
  }
}
