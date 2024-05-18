import { Type } from "@sinclair/typebox";
import { ClientProductSignatureStatus } from "@core/common/enums/models/signature";
import { imagesProductSchema } from "../image/imagesProductSchema";

export const productSingleViewSchema = Type.Object({
  product_id: Type.String(),
  name: Type.Union([Type.String(), Type.Null()]),
  slug: Type.Union([Type.String(), Type.Null()]),
  status: Type.String({ enum: Object.values(ClientProductSignatureStatus) }),
  price: Type.Number(),
  months: Type.Number(),
  months_description: Type.String(),
  images: imagesProductSchema,
});
