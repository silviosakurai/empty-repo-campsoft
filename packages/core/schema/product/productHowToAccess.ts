import { Type } from "@sinclair/typebox";

export const productHowToAccess = Type.Object({
  desktop: Type.Union([Type.String(), Type.Null()]),
  mobile: Type.Union([Type.String(), Type.Null()]),
  url_web: Type.Union([Type.String(), Type.Null()]),
  url_ios: Type.Union([Type.String(), Type.Null()]),
  url_android: Type.Union([Type.String(), Type.Null()]),
});
