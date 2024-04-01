import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { loginResponseSchema } from "@core/schema/login/loginResponseSchema";
import { Type } from "@fastify/type-provider-typebox";

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
    login_token: Type.String(),
  }),
  response: {
    200: Type.Object({
      message: Type.String(),
      status: Type.Boolean({ const: true }),
      data: Type.Object({
        result: loginResponseSchema,
        token: Type.String(),
      }),
    }),
    401: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Unauthorized" }
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
