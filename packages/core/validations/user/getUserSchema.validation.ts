import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";
import { TagSwagger } from "@core/common/enums/TagSwagger";

export const getUserSchema = {
  description: "Seleciona os dados do usuário",
  tags: [TagSwagger.user],
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
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop(
        "data",
        Schema.object()
          .prop("client_id", Schema.string().format("uuid"))
          .prop("status", Schema.enum(Object.values(ClientStatus)))
          .prop("first_name", Schema.string())
          .prop("last_name", Schema.string())
          .prop("birthday", Schema.string().format("date-time"))
          .prop("email", Schema.string().format("email"))
          .prop("phone", Schema.string())
          .prop("cpf", Schema.string())
          .prop("gender", Schema.enum(Object.values(ClientGender)))
          .prop("obs", Schema.string())
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
