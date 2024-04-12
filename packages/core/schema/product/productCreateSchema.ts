import { Type } from "@sinclair/typebox";
import { Status } from "@core/common/enums/Status";
import { pricesProductSchema } from "../price/pricesProductSchema";

export const productCreateSchema = Type.Object({
  product_id: Type.String(),
  product_type_id: Type.Number(),
  status: Type.String({ enum: Object.values(Status) }),
  name: Type.String(),
  long_description: Type.String(),
  short_description: Type.String(),
  marketing_phrases: Type.String(),
  content_provider_name: Type.String(),
  slug: Type.String(),
  prices: pricesProductSchema,
  obs: Type.String(),
});
