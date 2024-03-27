import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { IBannerReaderInput } from "@core/interfaces/repositories/banner";
import { BannerReaderRepository } from "@core/repositories/banner/BannerReader.repository";
import { injectable } from "tsyringe";

@injectable()
export class BannerService {
  private bannerReaderRepository: BannerReaderRepository;

  constructor(bannerReaderRepository: BannerReaderRepository) {
    this.bannerReaderRepository = bannerReaderRepository;
  }

  banners = async (tokenKeyData: ITokenKeyData, input: IBannerReaderInput) => {
    try {
      return await this.bannerReaderRepository.banners(tokenKeyData, input);
    } catch (error) {
      throw error;
    }
  };

  countTotal = async (
    tokenKeyData: ITokenKeyData,
    input: IBannerReaderInput
  ) => {
    try {
      return await this.bannerReaderRepository.countTotal(tokenKeyData, input);
    } catch (error) {
      throw error;
    }
  };
}
