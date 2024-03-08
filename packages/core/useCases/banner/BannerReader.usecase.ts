import { injectable } from "tsyringe";
import { BannerReaderRequestDto } from "./dtos/BannerReaderRequest.dto";
import { BannerReaderResponseDto } from "./dtos/BannerReaderResponse.dto";

@injectable()
export class BannerReaderUseCase {
  constructor() {}

  async read(
    input: BannerReaderRequestDto
  ): Promise<BannerReaderResponseDto | null> {
    return null;
  }
}
