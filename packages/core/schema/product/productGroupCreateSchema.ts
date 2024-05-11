import { Type } from "@sinclair/typebox";

export const productGroupCreateBodySchema = Type.Object({
  name: Type.String(),
  choices: Type.Number(),
});
