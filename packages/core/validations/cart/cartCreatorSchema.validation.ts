import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { cartCreatorResponseSchema } from "@core/schema/cart/cartCreatorResponseSchema";
import { Type } from "@sinclair/typebox";
import { cartCreateRequestSchema } from "./cartCreateRequestSchema";

export const cartCreatorSchemaValidation = {
  description: "Cria um novo carrinho",
  tags: [TagSwagger.cart],
  produces: ["application/json"],
  headers: Type.Object({
    "Accept-Language": Type.Optional(
      Type.String({
        description: "Idioma preferencial para a resposta",
        enum: Object.values(Language),
        default: Language.pt,
      })
    ),
  }),
  body: cartCreateRequestSchema,
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: cartCreatorResponseSchema,
      },
      { description: "Successful" }
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
