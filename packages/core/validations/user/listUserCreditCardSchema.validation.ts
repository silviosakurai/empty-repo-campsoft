import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Type } from "@sinclair/typebox";
import { Language } from "@core/common/enums/Language";

export const listUserCreditCardSchema = {
  description: "Lista os cartões de crédito do cliente",
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
        data: Type.Array(
          Type.Object({
            card_id: Type.String(),
            brand: Type.String(),
            first_digits: Type.String({ maxLength: 4 }),
            last_digits: Type.String({ maxLength: 4 }),
            expiration_month: Type.String({ maxLength: 2 }),
            expiration_year: Type.String({ maxLength: 2 }),
            default: Type.Boolean(),
          })
        ),
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
