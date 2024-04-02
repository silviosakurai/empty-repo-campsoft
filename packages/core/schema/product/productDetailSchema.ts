import { Type } from "@sinclair/typebox";
import { imagesProductSchema } from "../image/imagesProductSchema";
import { productTypeSchema } from "./productTypeSchema";
import { ProductVoucherStatus } from "@core/common/enums/models/product";

export const productDetailSchema = Type.Object({
  product_id: Type.String(),
  name: Type.String(),
  long_description: Type.String(),
  short_description: Type.String(),
  marketing_phrases: Type.String(),
  content_provider_name: Type.String(),
  slug: Type.String(),
  images: imagesProductSchema,
  product_type: productTypeSchema,
  status: Type.String({ enum: Object.values(ProductVoucherStatus) }),
  current_expiration: Type.String({ format: "date-time" }),
  expiration_date: Type.String({ format: "date-time" }),
  redemption_date: Type.String({ format: "date-time" }),
});
