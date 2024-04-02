import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { IBannerReaderInput } from "@core/interfaces/repositories/banner";
import { BannerReaderRepository } from "@core/repositories/banner/BannerReader.repository";
import { injectable } from "tsyringe";

@injectable()
export class BannerService {
  constructor(
    private readonly bannerReaderRepository: BannerReaderRepository
  ) {}

  list = async (tokenKeyData: ITokenKeyData, input: IBannerReaderInput) => {
    return this.bannerReaderRepository.banners(tokenKeyData, input);
  };

  countTotal = async (
    tokenKeyData: ITokenKeyData,
    input: IBannerReaderInput
  ) => {
    return this.bannerReaderRepository.countTotal(tokenKeyData, input);
  };
}
