import { Type } from "@sinclair/typebox";
import { imagesProductSchema } from "../image/imagesProductSchema";
import { productTypeSchema } from "./productTypeSchema";
import { productHowToAccess } from "./productHowToAccess";
import { Status } from "@core/common/enums/Status";

export const productDetailHowToAccessWithDatesSchema = Type.Object({
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
