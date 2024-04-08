import { Type } from "@sinclair/typebox";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { loginResponseSchema } from "@core/schema/login/loginResponseSchema";

export const loginSchema = {
  description: "Autentica o usuário e gera um token de acesso JWT",
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
    login: Type.String(),
    password: Type.String({ minLength: 6 }),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean({ const: true }),
        message: Type.String(),
        data: Type.Object({
          result: loginResponseSchema,
          token: Type.String(),
        }),
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