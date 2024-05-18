import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Type } from "@sinclair/typebox";
import { cartListResponseSchema } from "@core/schema/cart/cartListResponseSchema";
import { cartListRequestSchema } from "@core/schema/cart/cartListRequestSchema";
import { cartCreateRequestSchema } from "@core/schema/cart/cartCreateRequestSchema";

export const cartEditSchema = {
  description: "Edita um carrinho",
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
  params: cartListRequestSchema,
  body: cartCreateRequestSchema,
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: cartListResponseSchema,
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
