import { IPaginationResponse } from "@core/common/interfaces/IPaginationResponse";
import { IBannerItem } from "@core/interfaces/repositories/banner";

export type BannerReaderResponseDto = IPaginationResponse &
  BannerReaderResponse;

export type BannerReaderResponse = {
  results: BannerReaderResponseItem[];
};

export type BannerReaderResponseItem = {
  banner_id: number;
  location: string | null;
  type: number | null;
  banner_name: string | null;
  items: IBannerItem[];
};
