import { IPaginationQueryString } from "@core/common/interfaces/IPaginationQueryString";

export interface IBannerReaderInput extends IPaginationQueryString {
  location: string;
  type: number;
}
