import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Status } from "@core/common/enums/Status";
import {
  paginationReaderSchema,
  pagingResponseSchema,
} from "@core/common/validations/pagination.validation";
import { ProductFieldsToOrder } from "@core/common/enums/models/product";
import { SortOrder } from "@core/common/enums/SortOrder";

const HowToAccessSchema = Schema.object()
  .prop("desktop", Schema.string())
  .prop("mobile", Schema.string())
  .prop("url_web", Schema.string())
  .prop("url_ios", Schema.string())
  .prop("url_android", Schema.string());

const ImagesSchema = Schema.object()
  .prop("main_image", Schema.string())
  .prop("icon", Schema.string())
  .prop("logo", Schema.string())
  .prop("background_image", Schema.string());

const ProductTypeSchema = Schema.object()
  .prop("product_type_id", Schema.number())
  .prop("product_type_name", Schema.string());

const ProductResponseSchema = Schema.object()
  .prop("product_id", Schema.string())
  .prop("status", Schema.string().enum(Object.values(Status)))
  .prop("name", Schema.string())
  .prop("long_description", Schema.string())
  .prop("short_description", Schema.string())
  .prop("marketing_phrases", Schema.string())
  .prop("content_provider_name", Schema.string())
  .prop("slug", Schema.string())
  .prop("images", ImagesSchema)
  .prop("how_to_access", HowToAccessSchema)
  .prop("product_type", ProductTypeSchema)
  .prop("created_at", Schema.string().format("date-time"))
  .prop("updated_at", Schema.string().format("date-time"));

const ListProductResponseDtoSchema = Schema.object()
  .prop("results", Schema.array().items(ProductResponseSchema))
  .extend(pagingResponseSchema);

export const listProductSchema = {
  description: "Lista os produtos",
  tags: [TagSwagger.product],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
    },
  ],
  headers: Schema.object().prop(
    "Accept-Language",
    Schema.string()
      .description("Idioma preferencial para a resposta")
      .enum(Object.values(Language))
      .default(Language.pt)
  ),
  querystring: Schema.object()
    .prop("id", Schema.string())
    .prop(
      "status",
      Schema.string().enum(Object.values(Status)).default(Status.ACTIVE)
    )
    .prop("name", Schema.string())
    .prop("description", Schema.string())
    .prop("product_type", Schema.string())
    .prop("slug", Schema.string())
    .prop("sort_by", Schema.string().enum(Object.keys(ProductFieldsToOrder)))
    .prop("sort_order", Schema.string().enum(Object.values(SortOrder)))
    .extend(paginationReaderSchema),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop("data", ListProductResponseDtoSchema),
    401: Schema.object()
      .description("Unauthorized")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    404: Schema.object()
      .description("Not Found")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
    500: Schema.object()
      .description("Internal Server Error")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
  },
};
