import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { TFAType } from "@core/common/enums/models/tfa";

export const userPasswordRecoveryMethodsSchema = {
  description: "Seleciona os tipos de recuperação de senha do usuário",
  tags: [TagSwagger.user],
  operationId: "patchUser",
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
  params: Schema.object().prop("login", Schema.string().required()),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop(
        "data",
        Schema.object()
          .prop("client_id", Schema.string().format("uuid").required())
          .prop("name", Schema.string().required())
          .prop("profile_image", Schema.string().required())
          .prop(
            "recovery_types",
            Schema.array()
              .items(Schema.string().enum(Object.values(TFAType)))
              .required()
          )
      ),
    401: Schema.object()
      .description("Unauthorized")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    404: Schema.object()
      .description("Not Found")
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
