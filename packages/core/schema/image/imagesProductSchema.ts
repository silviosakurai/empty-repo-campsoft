import { Type } from "@sinclair/typebox";

export const imagesProductSchema = Type.Object({
  main_image: Type.Union([Type.String(), Type.Null()]),
  icon: Type.Union([Type.String(), Type.Null()]),
  logo: Type.Union([Type.String(), Type.Null()]),
  background_image: Type.Union([Type.String(), Type.Null()]),
});
