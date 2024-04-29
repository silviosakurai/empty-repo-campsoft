import { Type } from "@fastify/type-provider-typebox";
import { BannerItemFormat } from "@core/common/enums/models/banner";

export const bannerItemUpdaterResponseSchema = Type.Object({
  item_name: Type.String(),
  description: Type.String(),
  sort: Type.Number(),
  format:Type.String({ enum: Object.values(BannerItemFormat) }),
  html: Type.String(),
  link: Type.String(),
  start_date: Type.String(),
  end_date: Type.String(),
});
