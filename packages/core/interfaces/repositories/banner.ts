import { IPaginationQueryString } from "@core/common/interfaces/IPaginationQueryString";
import { bannerItemsSchema } from "@core/schema/banner/bannerItemsSchema";
import { Static } from "@sinclair/typebox";

export interface IBannerReaderInput extends IPaginationQueryString {
  location: string;
  type: number;
}

export interface IBanner {
  banner_id: number;
  location: string | null;
  type: number | null;
  banner_name: string | null;
}

export type IBannerItem = Static<typeof bannerItemsSchema>;
