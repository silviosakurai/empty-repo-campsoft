import { ClientSignatureRecorrencia } from "@core/common/enums/models/signature";
import { Type } from "@sinclair/typebox";

export const signatureActiveSchema = Type.Object({
  product_id: Type.String(),
  discount_percentage: Type.Number(),
  recurrence: Type.String({
    enum: Object.values(ClientSignatureRecorrencia),
  }),
  expiration_date: Type.String(),
});
