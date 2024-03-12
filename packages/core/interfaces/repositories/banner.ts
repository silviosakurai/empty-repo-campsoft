import { IPaginationQueryString } from "@core/common/interfaces/IPaginationQueryString";

export interface IBannerReaderInput extends IPaginationQueryString {
  location: string;
  type: number;
}

export interface IBanner {
  banner_id: number;
  location: string;
  type: number;
  banner_name: string;
}

export interface IBannerItem {
  banner_id: number;
  item_id: number;
  item_name: string;
  description: string;
  sort: number;
  format: string;
  images: {
    desktop: string;
    mobile: string;
  };
  html: string;
  link: string;
  start_date: string;
  end_date: string;
}
