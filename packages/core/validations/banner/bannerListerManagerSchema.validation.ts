import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { bannerReaderResponseSchema } from "@core/schema/banner/bannerReaderResponseSchema";
import { pagingRequestSchema } from "@core/schema/paging/pagingRequestSchema";
import { Type } from "@fastify/type-provider-typebox";

export const bannerListerManagerSchema = {
  description: "Lista os banners disponíveis",
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
  querystring: Type.Object({
    ...pagingRequestSchema.properties,
    location: Type.Optional(Type.String()),
    type: Type.Optional(Type.Integer({ minimum: 0 })),
    company_id: Type.Array(Type.Number()),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: bannerReaderResponseSchema,
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
