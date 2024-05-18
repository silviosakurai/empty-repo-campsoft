import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Type } from "@sinclair/typebox";
import { cartListRequestSchema } from "./cartListRequestSchema.validation";
import { cartListResponseSchema } from "@core/schema/cart/cartListResponseSchema";

export const cartListSchema = {
  description: "Lista o carrinho pelo id",
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
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: cartListResponseSchema,
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
