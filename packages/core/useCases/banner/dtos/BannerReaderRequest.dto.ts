import { IPaginationQueryString } from "@core/common/interfaces/IPaginationQueryString";

export interface BannerReaderRequestDto extends IPaginationQueryString {
  location: string;
  type: number;
}
