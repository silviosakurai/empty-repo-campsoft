export interface BannerUpdaterRequestParamsDto {
  bannerId: string;
}

export interface BannerUpdaterRequestQueryDto {
  company_id: number[];
}

export interface BannerUpdaterRequestDto {
  location: string;
  type: number;
  banner_name: string;
}
