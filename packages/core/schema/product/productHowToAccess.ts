import { Type } from "@sinclair/typebox";

export const productHowToAccess = Type.Object({

  como_acessar_mob: Type.Optional(Type.String()),
  como_acessar_url_and: Type.Optional(Type.String()),
  como_acessar_url_ios: Type.Optional(Type.String()),
  como_acessar_url: Type.Optional(Type.String()),
  como_acessar_desk: Type.Optional(Type.String()),
});

export interface UpdateParams {
  como_acessar_mob?: string;
  como_acessar_url_and?: string;
  como_acessar_url_ios?: string;
  como_acessar_url?: string;
  como_acessar_desk?: string;
}
