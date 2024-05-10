import { Type } from "@sinclair/typebox";
import { imagesProductSchema } from "../image/imagesProductSchema";
import { productTypeSchema } from "./productTypeSchema";
import { productHowToAccess } from "./productHowToAccess";
import { Status } from "@core/common/enums/Status";

export const planProductSchema = Type.Object({
  plans_name: Type.Union([Type.String(), Type.Null()]),
  low_price: Type.Union([Type.Number(), Type.Null()]),
});

export const marketingProductHighlightsListSchema = Type.Object({
  title: Type.Union([Type.String(), Type.Null()]),
  subtitle: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  image_background: Type.Union([Type.String(), Type.Null()]),
});

export const marketingProductInstitucionalListSchema = Type.Object({
  title: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  image_background: Type.Union([Type.String(), Type.Null()]),
  video_url: Type.Union([Type.String(), Type.Null()]),
});

export const productViewSchema = Type.Object({
  product_id: Type.String(),
  status: Type.Union([
    Type.String({ enum: Object.values(Status) }),
    Type.Null(),
  ]),
  name: Type.Union([Type.String(), Type.Null()]),
  short_description: Type.Union([Type.String(), Type.Null()]),
  marketing_phrases: Type.Union([Type.String(), Type.Null()]),
  content_provider_name: Type.Union([Type.String(), Type.Null()]),
  slug: Type.Union([Type.String(), Type.Null()]),
  images: imagesProductSchema,
  product_type: productTypeSchema,
  how_to_access: productHowToAccess,
  created_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
  updated_at: Type.Union([Type.String({ format: "date-time" }), Type.Null()]),
});

export const productViewSchemaResponse = Type.Object({
  ...productViewSchema.properties,
  plans: planProductSchema,
  institutional: Type.Array(marketingProductInstitucionalListSchema, {
    nullable: true,
  }),
  highlights: Type.Array(marketingProductHighlightsListSchema, {
    nullable: true,
  }),
});
