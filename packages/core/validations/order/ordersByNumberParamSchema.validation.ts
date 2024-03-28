import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";

export const ordersByNumberParamSchema = {
  description: "Seleciona um pedido pelo id",
  tags: [TagSwagger.order],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
      authenticateJwt: [],
    },
  ],
  headers: Schema.object().prop(
    "Accept-Language",
    Schema.string()
      .description("Idioma preferencial para a resposta")
      .enum(Object.values(Language))
      .default(Language.pt)
  ),
  params: Schema.object().prop(
    "orderNumber",
    Schema.string().format("uuid").required()
  ),
};
