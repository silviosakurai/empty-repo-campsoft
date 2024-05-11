import { Type } from "@sinclair/typebox";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";

export const postOrderPaymentPixSchema = {
  description: "Gera um novo pix",
  tags: [TagSwagger.order],
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
  params: Type.Object({
    orderNumber: Type.String({ format: "uuid" }),
  }),
  response: {
    201: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: Type.Object({
          url: Type.String(),
          code: Type.String(),
          expire_at: Type.String({ format: "date-time" }),
        }),
      },
      { description: "Created" }
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