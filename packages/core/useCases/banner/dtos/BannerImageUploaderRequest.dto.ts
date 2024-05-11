import { BannerImageType } from "@core/common/enums/models/banner";

export interface BannerImageRequestParamsDto {
  bannerId: string;
  bannerItemId: string;
  type: BannerImageType;
}

export interface BannerImageRequestBodyDto {
  image: string;
}
