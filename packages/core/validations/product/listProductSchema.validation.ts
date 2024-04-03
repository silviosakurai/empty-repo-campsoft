import { Language } from "@core/common/enums/Language";
import { ProductFields } from "@core/common/enums/models/product";
import { SortOrder } from "@core/common/enums/SortOrder";
import { Status } from "@core/common/enums/Status";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { pagingRequestSchema } from "@core/schema/paging/pagingRequestSchema";
import { productListResponseSchema } from "@core/schema/product/productListResponseSchema";
import { Type } from "@sinclair/typebox";

export const listProductSchema = {
  description: "Lista os produtos",
  tags: [TagSwagger.product],
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
      })
    ),
  }),
  querystring: Type.Object({
    ...pagingRequestSchema.properties,
    id: Type.Optional(Type.String()),
    status: Type.Optional(
      Type.String({
        enum: Object.values(Status),
        default: Status.ACTIVE,
      })
    ),
    name: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
    product_type: Type.Optional(Type.String()),
    slug: Type.Optional(Type.String()),
    sort_by: Type.Optional(
      Type.String({
        enum: Object.values(ProductFields),
        default: ProductFields.product_id,
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
        data: productListResponseSchema,
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
