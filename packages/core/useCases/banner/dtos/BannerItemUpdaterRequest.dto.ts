import { BannerItemFormat } from "@core/common/enums/models/banner";

export interface BannerItemUpdaterParamsRequestDto {
  bannerId: string;
  bannerItemId: string;
}

export interface BannerItemUpdaterParamsQueryDto {
  company_id: number[];
}

export interface BannerItemUpdaterRequestDto {
  item_name: string;
  description: string;
  sort: number;
  format: BannerItemFormat;
  html: string;
  link: string;
  start_date: string;
  end_date: string;
}
