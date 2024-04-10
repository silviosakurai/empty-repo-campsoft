import { Type } from "@fastify/type-provider-typebox";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { userPutAddressResponseSchema } from "@core/schema/user/userPutAddressResponseSchema";

export const putUserShippingAddressSchema = {
  description: "Atualiza ou adiciona o endereço de envio",
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
  body: Type.Object({
    shipping_address: Type.Optional(Type.Boolean()),
    zip_code: Type.String(),
    street: Type.String(),
    number: Type.String(),
    complement: Type.String(),
    neighborhood: Type.String(),
    phone: Type.String(),
    city: Type.String(),
    state: Type.String(),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: userPutAddressResponseSchema,
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
