import { Type } from "@sinclair/typebox";
import { imagesProductSchema } from "../image/imagesProductSchema";
import { productTypeSchema } from "./productTypeSchema";

export const productDetailPlanProductsSchema = Type.Object({
  product_id: Type.String(),
  status: Type.String({ nullable: true }),
  name: Type.String({ nullable: true }),
  long_description: Type.String({ nullable: true }),
  short_description: Type.String({ nullable: true }),
  marketing_phrases: Type.String({ nullable: true }),
  content_provider_name: Type.String({ nullable: true }),
  slug: Type.String({ nullable: true }),
  images: imagesProductSchema,
  product_type: productTypeSchema,
});
