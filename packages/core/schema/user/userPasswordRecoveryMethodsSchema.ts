import { Type } from "@sinclair/typebox";
import { TFAType } from "@core/common/enums/models/tfa";

export const userPasswordRecoveryMethodsResponseSchema = Type.Object({
  client_id: Type.String({ format: "uuid" }),
  name: Type.String(),
  profile_image: Type.String(),
  recovery_types: Type.Array(Type.String({ enum: Object.values(TFAType) })),
});
