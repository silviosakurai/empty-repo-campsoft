import { Type } from "@sinclair/typebox";
import { imagesProductSchema } from "../image/imagesProductSchema";
import { productTypeSchema } from "./productTypeSchema";
import { productHowToAccess } from "./productHowToAccess";

export const productDetailPlanProductsHowToAccessSchema = Type.Object({
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
});
