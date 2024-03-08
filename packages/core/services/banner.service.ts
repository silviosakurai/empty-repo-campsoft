import { IBannerReaderInput } from "@core/interfaces/repositories/banner";
import { BannerReaderRepository } from "@core/repositories/banner/BannerReader.repository";
import { injectable } from "tsyringe";

@injectable()
export class BannerService {
  private bannerReaderRepository: BannerReaderRepository;

  constructor(bannerReaderRepository: BannerReaderRepository) {
    this.bannerReaderRepository = bannerReaderRepository;
  }

  read = async (input: IBannerReaderInput) => {
    try {
      return await this.bannerReaderRepository.read(input);
    } catch (error) {
      throw error;
    }
  };
}
