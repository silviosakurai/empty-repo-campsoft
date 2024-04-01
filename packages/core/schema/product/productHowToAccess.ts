import { Type } from "@sinclair/typebox";

export const productHowToAccess = Type.Object({
  desktop: Type.String(),
  mobile: Type.String(),
  url_web: Type.String(),
  url_ios: Type.String(),
  url_android: Type.String(),
});
