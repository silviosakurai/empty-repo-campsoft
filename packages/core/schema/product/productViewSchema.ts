import { Type } from "@sinclair/typebox";
import { imagesProductSchema } from "../image/imagesProductSchema";
import { productTypeSchema } from "./productTypeSchema";
import { productHowToAccess } from "./productHowToAccess";
import { Status } from "@core/common/enums/Status";

export const planProductSchema = Type.Object({
  plans_name: Type.Union([Type.String(), Type.Null()]),
  low_price: Type.Union([Type.Number(), Type.Null()]),
});

export const marketingProductMagazinesListSchema = Type.Object({
  title: Type.Union([Type.String(), Type.Null()]),
  image_background: Type.Union([Type.String(), Type.Null()]),
});

export const marketingProductSectionsListSchema = Type.Object({
  title: Type.Union([Type.String(), Type.Null()]),
  image_background: Type.Union([Type.String(), Type.Null()]),
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

export const ebooksAudiolivrosListSchema = Type.Object({
  title: Type.Union([Type.String(), Type.Null()]),
  image_background: Type.Union([Type.String(), Type.Null()]),
});

export const marketingProductInstitutionalMiddleListSchema = Type.Object({
  title: Type.Union([Type.String(), Type.Null()]),
  subtitle: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
  image_background: Type.Union([Type.String(), Type.Null()]),
});

export const marketingProductNumbersListSchema = Type.Object({
  number: Type.Union([Type.String(), Type.Null()]),
  description: Type.Union([Type.String(), Type.Null()]),
});

export const reviewListResponseSchema = Type.Object({
  review_id: Type.Number(),
  status: Type.String(),
  name: Type.String(),
  review: Type.String(),
  photo: Type.String(),
  rating: Type.Number(),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
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
  institutional_middle: Type.Array(
    marketingProductInstitutionalMiddleListSchema,
    {
      nullable: true,
    }
  ),
  highlights: Type.Array(marketingProductHighlightsListSchema, {
    nullable: true,
  }),
  magazines: Type.Array(marketingProductMagazinesListSchema, {
    nullable: true,
  }),
  sections: Type.Array(marketingProductSectionsListSchema, {
    nullable: true,
  }),
  ebooks_audiolivros: Type.Array(ebooksAudiolivrosListSchema, {
    nullable: true,
  }),
  numbers: Type.Array(marketingProductNumbersListSchema, {
    nullable: true,
  }),
  reviews: Type.Array(reviewListResponseSchema, { nullable: true }),
});
