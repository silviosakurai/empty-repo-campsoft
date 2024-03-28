import { Type } from "@fastify/type-provider-typebox";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { userPasswordRecoveryMethodsResponseSchema } from "@core/schema/user/userPasswordRecoveryMethodsSchema";

export const userPasswordRecoveryMethodsSchema = {
  description: "Seleciona os tipos de recuperação de senha do usuário",
  tags: [TagSwagger.user],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
    },
  ],
  headers: Type.Object({
    "Accept-Language": Type.String({
      description: "Idioma preferencial para a resposta",
      enum: Object.values(Language),
      default: Language.pt,
    }),
  }),
  params: Type.Object({
    login: Type.String(),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: userPasswordRecoveryMethodsResponseSchema,
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
