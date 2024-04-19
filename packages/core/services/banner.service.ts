import { BannerImageType } from "@core/common/enums/models/banner";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { IBannerReaderInput } from "@core/interfaces/repositories/banner";
import { BannerCreatorRepository } from "@core/repositories/banner/BannerCreator.repository";
import { BannerDeleterRepository } from "@core/repositories/banner/BannerDeleter.repository";
import { BannerItemCreatorRepository } from "@core/repositories/banner/BannerItemCreator.repository";
import { BannerItemDeleterRepository } from "@core/repositories/banner/BannerItemDeleter.repository";
import { BannerItemImageUpdaterRepository } from "@core/repositories/banner/BannerItemImageUpdater.repository";
import { BannerItemUpdaterRepository } from "@core/repositories/banner/BannerItemUpdater.repository";
import { BannerListerRepository } from "@core/repositories/banner/BannerLister.repository";
import { BannerReaderRepository } from "@core/repositories/banner/BannerReader.repository";
import { BannerUpdaterRepository } from "@core/repositories/banner/BannerUpdater.repository";
import { BannerViewerRepository } from "@core/repositories/banner/BannerViewer.repository";
import { BannerCreatorRequestDto } from "@core/useCases/banner/dtos/BannerCreatorRequest.dto";
import { BannerItemCreatorRequest } from "@core/useCases/banner/dtos/BannerItemCreatorRequest.dto";
import { BannerItemUpdaterRequestDto } from "@core/useCases/banner/dtos/BannerItemUpdaterRequest.dto";
import { BannerUpdaterRequestDto } from "@core/useCases/banner/dtos/BannerUpdaterRequest.dto";
import { injectable } from "tsyringe";

@injectable()
export class BannerService {
  constructor(
    private readonly bannerReaderRepository: BannerReaderRepository,
    private readonly bannerListerRepository: BannerListerRepository,
    private readonly bannerViewerRepository: BannerViewerRepository,
    private readonly bannerCreatorRepository: BannerCreatorRepository,
    private readonly bannerItemCreatorRepository: BannerItemCreatorRepository,
    private readonly bannerUpdaterRepository: BannerUpdaterRepository,
    private readonly bannerItemUpdaterRepository: BannerItemUpdaterRepository,
    private readonly bannerDeleterRepository: BannerDeleterRepository,
    private readonly bannerItemDeleterRepository: BannerItemDeleterRepository,
    private readonly bannerItemImageUpdaterRepository: BannerItemImageUpdaterRepository,
  ) {}

  list = async (tokenKeyData: ITokenKeyData, input: IBannerReaderInput) => {
    return this.bannerReaderRepository.banners(tokenKeyData, input);
  };

  listByPartner = async (companyIds: number[], input: IBannerReaderInput) => {
    return this.bannerListerRepository.banners(companyIds, input);
  };

  viewByPartner = async (companyIds: number[], bannerId: number) => {
    return this.bannerViewerRepository.view(companyIds, bannerId);
  };

  countTotal = async (
    tokenKeyData: ITokenKeyData,
    input: IBannerReaderInput
  ) => {
    return this.bannerReaderRepository.countTotal(tokenKeyData, input);
  };

  countTotalByPartner = async (
    companyIds: number[],
    input: IBannerReaderInput
  ) => {
    return this.bannerListerRepository.countTotal(companyIds, input);
  };

  create = async (input: BannerCreatorRequestDto) => {
    return this.bannerCreatorRepository.create(input);
  };

  createItem = async (bannerId: number, input: BannerItemCreatorRequest) => {
    return this.bannerItemCreatorRepository.create(bannerId, input);
  };

  createImage = async (
    bannerId: number,
    bannerItemId: number,
    type: BannerImageType,
    imageUrl: string,
  ) => {
    return this.bannerItemImageUpdaterRepository.update(
      bannerId,
      bannerItemId,
      type,
      imageUrl,
    );
  };

  update = async (bannerId: number, input: BannerUpdaterRequestDto) => {
    return this.bannerUpdaterRepository.update(bannerId, input);
  };

  updateItem = async (
    bannerId: number,
    bannerItemId: number,
    input: BannerItemUpdaterRequestDto,
  ) => {
    return this.bannerItemUpdaterRepository.update(bannerId, bannerItemId, input);
  };

  delete = async (bannerId: number) => {
    return this.bannerDeleterRepository.delete(bannerId);
  };

  deleteItem = async (
    bannerId: number,
    bannerItemId: number,
  ) => {
    return this.bannerItemDeleterRepository.delete(bannerId, bannerItemId);
  };
}
