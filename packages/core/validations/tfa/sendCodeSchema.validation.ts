import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { TFAType } from "@core/common/enums/models/tfa";

export const sendCodeSchema = {
  description: "Envia um código de 6 dígitos para o usuário validar",
  tags: [TagSwagger.tfa],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
    },
  ],
  headers: Schema.object().prop(
    "Accept-Language",
    Schema.string()
      .description("Idioma preferencial para a resposta")
      .enum(Object.values(Language))
      .default(Language.pt)
  ),
  body: Schema.object()
    .prop("type", Schema.string().required().enum(Object.values(TFAType)))
    .prop("login", Schema.string().required()),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    400: Schema.object()
      .description("Bad Request")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    401: Schema.object()
      .description("Unauthorized")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    500: Schema.object()
      .description("Internal Server Error")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
  },
};
