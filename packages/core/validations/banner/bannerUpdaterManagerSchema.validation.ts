import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Type } from "@fastify/type-provider-typebox";
import { bannerUpdaterRequestSchema } from "@core/schema/banner/bannerUpdaterRequestSchema";
import { bannerUpdaterResponseSchema } from "@core/schema/banner/bannerUpdaterResponseSchema";

export const bannerUpdaterManagerSchema = {
  description: "Atualiza um banner",
  tags: [TagSwagger.banner],
  produces: ["application/json"],
  security: [
    {
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
  body: bannerUpdaterRequestSchema,
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: bannerUpdaterResponseSchema,
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
