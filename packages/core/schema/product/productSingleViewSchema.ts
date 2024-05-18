import { Type } from "@sinclair/typebox";
import { ClientProductSignatureStatus } from "@core/common/enums/models/signature";

export const productSingleViewSchema = Type.Object({
  product_id: Type.String(),
  status: Type.String({ enum: Object.values(ClientProductSignatureStatus) }),
  price: Type.Number(),
  months: Type.Number(),
  months_description: Type.String(),
});
