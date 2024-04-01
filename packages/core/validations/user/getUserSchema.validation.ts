import { Type } from "@fastify/type-provider-typebox";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { userResponseSchema } from "@core/schema/user/userResponseSchema";

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
  headers: Type.Object({
    "Accept-Language": Type.Optional(
      Type.String({
        description: "Idioma preferencial para a resposta",
        enum: Object.values(Language),
        default: Language.pt,
      })
    ),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: userResponseSchema,
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
