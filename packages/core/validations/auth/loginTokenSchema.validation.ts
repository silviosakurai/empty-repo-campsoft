import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

const LoginResponseSchema = Schema.object()
  .prop("client_id", Schema.string().format("uuid"))
  .prop("status", Schema.string().enum(Object.values(ClientStatus)))
  .prop("facebook_id", Schema.integer())
  .prop("name", Schema.string())
  .prop("surname", Schema.string())
  .prop("birth_date", Schema.string().format("date-time"))
  .prop("email", Schema.string().format("email"))
  .prop("phone", Schema.string().required())
  .prop("cpf", Schema.string())
  .prop("gender", Schema.string().enum(Object.values(ClientGender)));

export const loginTokenSchema = {
  description:
    "Autentica o usuário e gera um token de acesso JWT a partir de um login_token válido",
  tags: [TagSwagger.authentication],
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
  body: Schema.object().prop("login_token", Schema.string().required()),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("message", Schema.string())
      .prop("status", Schema.boolean().const(true))
      .prop(
        "data",
        Schema.object()
          .prop("result", LoginResponseSchema)
          .prop("token", Schema.string())
      ),
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
