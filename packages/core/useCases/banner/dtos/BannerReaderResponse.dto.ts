import { IBannerItem } from "@core/interfaces/repositories/banner";
import { bannerReaderResponseSchema } from "@core/schema/banner/bannerReaderResponseSchema";
import { Static } from "@fastify/type-provider-typebox";

export type BannerReaderResponseDto = Static<typeof bannerReaderResponseSchema>;

export type BannerReaderResponseItem = {
  banner_id: number;
  location: string | null;
  type: number | null;
  banner_name: string | null;
  items: IBannerItem[];
};
