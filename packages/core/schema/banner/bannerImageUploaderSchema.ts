import { BannerImageType } from "@core/common/enums/models/banner";
import { Type } from "@sinclair/typebox";

export const bannerImageUploaderParamsSchema = Type.Object({
  bannerId: Type.String(),
  bannerItemId: Type.String(),
  type: Type.String({ enum: Object.values(BannerImageType) }),
});

export const bannerImageUploaderBodySchema = Type.Object({
  image: Type.String(),
});
