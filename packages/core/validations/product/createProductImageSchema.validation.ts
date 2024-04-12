import { Type } from "@sinclair/typebox";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { productCreateResponseSchema } from "@core/schema/product/productCreateResponseSchema";

export const createProductImageSchema = {
  description: "Cadastra uma nova imagem para o produto",
  tags: [TagSwagger.product],
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
    "Content-Type": Type.String({ default: "multipart/form-data" }),
  }),
  // body: productCreateSchema,
  params: Type.Object({
    sku: Type.String(),
    type: Type.String({ enum: ["image", "logo", "icon"] }),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: productCreateResponseSchema,
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
