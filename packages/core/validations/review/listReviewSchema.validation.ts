import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { reviewListResponseSchema } from "@core/schema/review/previewListResponseSchema";
import { Type } from "@sinclair/typebox";

export const listReviewSchema = {
  description: "Lista os depoimentos",
  tags: [TagSwagger.review],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
    },
  ],
  headers: Type.Object({
    "Accept-Language": Type.Optional(
      Type.String({
        description: "Idioma preferencial para a resposta",
        enum: Object.values(Language),
        default: Language.pt,
      }),
    ),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: reviewListResponseSchema,
      },
      { description: "Successful" },
    ),
    401: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Unauthorized" },
    ),
    500: Type.Object(
      {
        status: Type.Boolean({ default: false }),
        message: Type.String(),
        data: Type.Null(),
      },
      { description: "Internal Server Error" },
    ),
  },
};
