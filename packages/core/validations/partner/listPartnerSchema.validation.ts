import { Type } from "@sinclair/typebox";
import { Status } from "@core/common/enums/Status";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { pagingRequestSchema } from "@core/schema/paging/pagingRequestSchema";
import { partnerListResponseSchema } from "@core/schema/partner/partnerListResponseSchema";

export const listPartnerSchema = {
  description: "Listar parceiros",
  tags: [TagSwagger.product],
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
  querystring: Type.Object({
    ...pagingRequestSchema.properties,
    id: Type.Optional(Type.Number()),
    id_partner_type: Type.Optional(Type.Number()),
    status: Type.Optional(
      Type.String({
        enum: Object.values(Status),
        default: Status.ACTIVE,
      })
    ),
    trade_name: Type.Optional(Type.String()),
    legal_name: Type.Optional(Type.String()),
    cnpj: Type.Optional(Type.Number()),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: partnerListResponseSchema,
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
