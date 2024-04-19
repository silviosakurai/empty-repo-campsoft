import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Type } from "@fastify/type-provider-typebox";
import { bannerItemUpdaterRequestSchema } from "@core/schema/banner/bannerItemUpdaterRequestSchema";
import { bannerItemUpdaterResponseSchema } from "@core/schema/banner/bannerItemUpdaterResponseSchema";

export const bannerItemUpdaterPartnerSchema = {
  description: "Atualiza um item em um banner",
  tags: [TagSwagger.banner],
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
    bannerId: Type.String(),
    bannerItemId: Type.String(),
  }),
  body: bannerItemUpdaterRequestSchema,
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: bannerItemUpdaterResponseSchema,
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
