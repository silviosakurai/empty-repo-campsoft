import { Type } from "@fastify/type-provider-typebox";
import { Language } from "@core/common/enums/Language";
import { ClientGender } from "@core/common/enums/models/client";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { userCreatorResponseSchema } from "@core/schema/user/userCreatorResponseSchema";

export const userCreatorPartnerSchema = {
  description: "Cria um novo usuário",
  tags: [TagSwagger.user],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
      authenticateTfa: [],
    },
  ],
  headers: Type.Object({
    "Accept-Language": Type.Optional(
      Type.String({
        description: "Idioma preferencial para a resposta",
        enum: Object.values(Language),
        default: Language.pt,
      })
    ),
  }),
  body: Type.Object({
    user_type: Type.Number(),
    leader_id: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
    birthday: Type.String({ format: "date" }),
    email: Type.String({ format: "email" }),
    phone: Type.String({ minLength: 11, maxLength: 12 }),
    cpf: Type.String({ minLength: 11, maxLength: 11 }),
    gender: Type.String({ enum: Object.values(ClientGender) }),
    obs: Type.Optional(Type.String()),
  }),
  response: {
    201: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: userCreatorResponseSchema,
      },
      { description: "Successful" }
    ),
    401: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Unauthorized" }
    ),
    403: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Forbidden" }
    ),
    409: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Conflict" }
    ),
    500: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Internal Server Error" }
    ),
  },
};
