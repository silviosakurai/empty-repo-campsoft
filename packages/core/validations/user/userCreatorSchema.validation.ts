import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";
import { TagSwagger } from "@core/common/enums/TagSwagger";

export const userCreatorSchema = {
  description: "Cria um novo usuário",
  tags: [TagSwagger.user],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
      authenticateTfa: [],
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
    .prop("status", Schema.enum(Object.values(ClientStatus)).required())
    .prop("first_name", Schema.string().required())
    .prop("last_name", Schema.string().required())
    .prop("birthday", Schema.string().format("date").required())
    .prop("email", Schema.string().format("email").required())
    .prop("phone", Schema.string().minLength(11).maxLength(12).required())
    .prop("cpf", Schema.string().minLength(11).maxLength(11).required())
    .prop("password", Schema.string().minLength(6).required())
    .prop("gender", Schema.enum(Object.values(ClientGender)).required())
    .prop("obs", Schema.string()),
  response: {
    201: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop(
        "data",
        Schema.object().prop("user_id", Schema.string().format("uuid"))
      ),
    401: Schema.object()
      .description("Unauthorized")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    403: Schema.object()
      .description("Forbidden")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    409: Schema.object()
      .description("Conflict")
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
