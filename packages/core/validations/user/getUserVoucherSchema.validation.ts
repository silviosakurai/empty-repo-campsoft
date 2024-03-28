import { Type } from "@fastify/type-provider-typebox";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { userVoucherResponseSchema } from "@core/schema/user/userVoucherResponseSchema";

export const getUserVoucherSchema = {
  description: "Obtém informações do voucher do usuário",
  tags: [TagSwagger.user],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
      authenticateJwt: [],
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
    voucherCode: Type.String(),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: userVoucherResponseSchema,
      },
      { description: "Successful" }
    ),
    400: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Bad Request" }
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
