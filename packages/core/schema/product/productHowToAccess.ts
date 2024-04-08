import { Type } from "@sinclair/typebox";

export const productHowToAccess = Type.Object({
  desktop: Type.Optional(Type.String()),
  mobile: Type.Optional(Type.String()),
  url_web: Type.Optional(Type.String()),
  url_ios: Type.Optional(Type.String()),
  url_android: Type.Optional(Type.String()),
});
