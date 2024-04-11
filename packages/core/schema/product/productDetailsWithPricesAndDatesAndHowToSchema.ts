import { Type } from "@sinclair/typebox";
import { imagesProductSchema } from "../image/imagesProductSchema";
import { productTypeSchema } from "./productTypeSchema";
import { productHowToAccess } from "./productHowToAccess";
import { pricesProductSchema } from "../price/pricesProductSchema";

export const productDetailsWithPricesAndDatesAndHowToSchema = Type.Object({
  product_id: Type.String(),
  status: Type.String(),
  name: Type.String(),
  long_description: Type.String(),
  short_description: Type.String(),
  marketing_phrases: Type.String(),
  content_provider_name: Type.String(),
  slug: Type.String(),
  images: imagesProductSchema,
  product_type: productTypeSchema,
  how_to_access: productHowToAccess,
  prices: pricesProductSchema,
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
