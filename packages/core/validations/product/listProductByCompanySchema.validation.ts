import { Language } from "@core/common/enums/Language";
import { ProductOrderPartner } from "@core/common/enums/models/product";
import { SortOrder } from "@core/common/enums/SortOrder";
import { Status } from "@core/common/enums/Status";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { pagingRequestSchema } from "@core/schema/paging/pagingRequestSchema";
import { productListGroupedByCompanyResponseSchema } from "@core/schema/product/productListGroupedByCompanyResponseSchema";
import { Type } from "@sinclair/typebox";

export const listProductByCompanySchema = {
  description: "Lista os produtos",
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
    id: Type.Optional(Type.String()),
    company_id: Type.Optional(Type.Array(Type.Number())),
    status: Type.Optional(
      Type.String({
        enum: Object.values(Status),
        default: Status.ACTIVE,
      })
    ),
    name: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    product_type_id: Type.Optional(Type.Number()),
    slug: Type.Optional(Type.String()),
    sort_by: Type.Optional(
      Type.String({
        enum: Object.values(ProductOrderPartner),
        default: ProductOrderPartner.created_at,
      })
    ),
    sort_order: Type.Optional(
      Type.String({ enum: Object.values(SortOrder), default: SortOrder.DESC })
    ),
  }),
  response: {
    200: Type.Object(
      {
        status: Type.Boolean(),
        message: Type.String(),
        data: productListGroupedByCompanyResponseSchema,
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
