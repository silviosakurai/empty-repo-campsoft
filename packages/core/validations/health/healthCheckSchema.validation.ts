import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";

export const healthCheckSchema = {
  description: "Verifica a saúde da aplicação",
  tags: [TagSwagger.health],
  produces: ["application/json"],
  headers: Schema.object().prop(
    "Accept-Language",
    Schema.string()
      .description("Idioma preferencial para a resposta")
      .enum(Object.values(Language))
      .default(Language.pt)
  ),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
  },
};
