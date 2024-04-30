import { Type } from "@sinclair/typebox";

export const productUpdateDetailHowToAccessSchema = Type.Object({
  type: Type.String(),
  content: Type.String(),
  url: Type.String(),
});
