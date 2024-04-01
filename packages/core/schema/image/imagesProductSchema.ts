import { Type } from "@sinclair/typebox";

export const imagesProductSchema = Type.Object({
  main_image: Type.String(),
  icon: Type.String(),
  logo: Type.String(),
  background_image: Type.String(),
});
