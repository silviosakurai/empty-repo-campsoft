import { Type } from "@sinclair/typebox";

export const productHowToAccessRequest = Type.Object({
  type: Type.String(),
  content: Type.String(),
  url: Type.String(),
});
