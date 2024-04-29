import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Type } from "@fastify/type-provider-typebox";
import { bannerItemCreatorRequestSchema } from "@core/schema/banner/bannerItemCreatorRequestSchema";
import { bannerItemCreatorResponseSchema } from "@core/schema/banner/bannerItemCreatorResponseSchema";

export const bannerItemCreatorPartnerSchema = {
  description: "Adiciona item ao banner",
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
  }),
  body: bannerItemCreatorRequestSchema,
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: bannerItemCreatorResponseSchema,
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
