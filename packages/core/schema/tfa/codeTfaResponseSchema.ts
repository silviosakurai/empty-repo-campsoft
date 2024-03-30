import { Type } from "@sinclair/typebox";

export const codeTfaResponseSchema = Type.Object({
  token: Type.String(),
});
