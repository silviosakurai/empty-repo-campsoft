import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import {
  paginationReaderSchema,
  pagingResponseSchema,
} from "@core/common/validations/pagination.validation";

const BannerItemImageSchema = Schema.object()
  .prop("desktop", Schema.string().format("uri"))
  .prop("mobile", Schema.string().format("uri"));

const BannerItemSchema = Schema.object()
  .prop("banner_id", Schema.number())
  .prop("item_id", Schema.number())
  .prop("item_name", Schema.string())
  .prop("description", Schema.string())
  .prop("sort", Schema.number())
  .prop("format", Schema.string())
  .prop("images", BannerItemImageSchema)
  .prop("html", Schema.string())
  .prop("link", Schema.string().format("uri"))
  .prop("start_date", Schema.string().format("date-time"))
  .prop("end_date", Schema.string().format("date-time"));

const BannerReaderResponseItemSchema = Schema.object()
  .prop("banner_id", Schema.number())
  .prop("location", Schema.string())
  .prop("type", Schema.number())
  .prop("banner_name", Schema.string())
  .prop("items", Schema.array().items(BannerItemSchema));

const BannerReaderResponseDtoSchema = Schema.object()
  .prop("results", Schema.array().items(BannerReaderResponseItemSchema))
  .extend(pagingResponseSchema);

export const bannerReaderSchema = {
  description: "Lista os banners disponíveis",
  tags: [TagSwagger.banner],
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
    .prop("location", Schema.string())
    .prop("type", Schema.integer().minimum(0))
    .extend(paginationReaderSchema),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop("data", BannerReaderResponseDtoSchema),
    401: Schema.object()
      .description("Unauthorized")
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
