import { userPasswordRecoveryMethodsResponseSchema } from "@core/schema/user/userPasswordRecoveryMethodsSchema";
import { Static } from "@sinclair/typebox";

export type PasswordRecoveryMethodsClientResponse = Static<
  typeof userPasswordRecoveryMethodsResponseSchema
>;
