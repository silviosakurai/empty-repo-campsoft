import { Type } from "@sinclair/typebox";

export const productHowToAccessManager = Type.Object({
  como_acessar_mob: Type.Optional(Type.String()),
  como_acessar_url_and: Type.Optional(Type.String()),
  como_acessar_url_ios: Type.Optional(Type.String()),
  como_acessar_url: Type.Optional(Type.String()),
  como_acessar_desk: Type.Optional(Type.String()),
});
