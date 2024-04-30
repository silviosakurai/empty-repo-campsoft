import { Type } from "@sinclair/typebox";

export const productGroupViewSchema = Type.Object({
  name: Type.String(),
  choices: Type.Number(),
  products: Type.Array(Type.String()),
});
