import { BannerItemFormat } from "@core/common/enums/models/banner";

export interface BannerItemCreatorRequest {
  item_name: string;
  description: string;
  sort: number;
  format: BannerItemFormat;
  html: string;
  link: string;
  start_date: string;
  end_date: string;
}
