import { IPaginationResponse } from "@core/common/interfaces/IPaginationResponse";

export type BannerReaderResponseDto = IPaginationResponse &
  BannerReaderResponse;

export type BannerReaderResponse = {
  results: BannerReaderResponseItem[];
};

export type BannerReaderResponseItem = {
  location: string;
  type: number;
  banner_name: string | null;
  items: [
    item_name: string | null,
    description: string | null,
    sort: number | null,
    format: string | null,
    images: {
      desktop: string | null;
      mobile: string | null;
    },
    html: string | null,
    link: string | null,
    start_date: Date,
    end_date: Date,
  ];
};
