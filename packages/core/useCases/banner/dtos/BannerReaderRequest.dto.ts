import { IPaginationQueryString } from "@core/common/interfaces/IPaginationQueryString";

export interface BannerReaderRequestDto extends IPaginationQueryString {
  company_id: number[];
  location: string;
  type: number;
}
