import { Type } from "@fastify/type-provider-typebox";
import { Language } from "@core/common/enums/Language";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";
import { TagSwagger } from "@core/common/enums/TagSwagger";

export const userUpdateByIdSchema = {
  description: "Atualiza os dados do usuário",
  tags: [TagSwagger.user],
  produces: ["application/json"],
  security: [
    {
      authenticateJwt: [],
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
    leader_id: Type.Optional(Type.String()),
    status: Type.String({ enum: Object.values(ClientStatus) }),
    first_name: Type.String(),
    last_name: Type.String(),
    birthday: Type.String({ format: "date" }),
    email: Type.String(),
    phone: Type.String(),
    gender: Type.String({ enum: Object.values(ClientGender) }),
    obs: Type.Optional(Type.String()),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: Type.Null(),
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
    404: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Not Found" }
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