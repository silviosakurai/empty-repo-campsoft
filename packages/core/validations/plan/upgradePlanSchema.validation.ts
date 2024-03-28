import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { Status } from "@core/common/enums/Status";

const PlanPriceSchema = Schema.object()
  .prop("months", Schema.number())
  .prop("price", Schema.number())
  .prop("discount_value", Schema.number())
  .prop("discount_percentage", Schema.number())
  .prop("price_with_discount", Schema.number());

const ProductResponseSchema = Schema.object()
  .prop("product_id", Schema.string())
  .prop("status", Schema.string().enum(Object.values(Status)))
  .prop("name", Schema.string())
  .prop("long_description", Schema.string())
  .prop("short_description", Schema.string())
  .prop("marketing_phrases", Schema.string())
  .prop("content_provider_name", Schema.string())
  .prop("slug", Schema.string())
  .prop(
    "images",
    Schema.object()
      .prop("main_image", Schema.string())
      .prop("icon", Schema.string())
      .prop("logo", Schema.string())
      .prop("background_image", Schema.string())
  )
  .prop(
    "how_to_access",
    Schema.object()
      .prop("desktop", Schema.string())
      .prop("mobile", Schema.string())
      .prop("url_web", Schema.string())
      .prop("url_ios", Schema.string())
      .prop("url_android", Schema.string())
  )
  .prop(
    "product_type",
    Schema.object()
      .prop("product_type_id", Schema.number())
      .prop("product_type_name", Schema.string())
  )
  .prop("created_at", Schema.string().format("date-time"))
  .prop("updated_at", Schema.string().format("date-time"));

const ProductsGroupsSchema = Schema.object()
  .prop("product_group_id", Schema.number())
  .prop("name", Schema.string())
  .prop("quantity", Schema.number())
  .prop("available_products", Schema.array().items(ProductResponseSchema));

const PlanSchema = Schema.object()
  .prop("plan_id", Schema.number())
  .prop("status", Schema.string().enum(Object.values(Status)))
  .prop("visible_site", Schema.boolean())
  .prop("business_id", Schema.number())
  .prop("plan", Schema.string())
  .prop("image", Schema.string())
  .prop("description", Schema.string())
  .prop("short_description", Schema.string())
  .prop("created_at", Schema.string().format("date-time"))
  .prop("updated_at", Schema.string().format("date-time"))
  .prop("prices", Schema.array().items(PlanPriceSchema))
  .prop("products", Schema.array().items(ProductResponseSchema))
  .prop("product_groups", Schema.array().items(ProductsGroupsSchema));

export const upgradePlanSchema = {
  description: "Exibe os planos que é possível fazer upgrade",
  tags: [TagSwagger.plan],
  produces: ["application/json"],
  security: [
    {
      authenticateKeyApi: [],
      authenticateJwt: [],
    },
  ],
  headers: Schema.object().prop(
    "Accept-Language",
    Schema.string()
      .description("Idioma preferencial para a resposta")
      .enum(Object.values(Language))
      .default(Language.pt)
  ),
  querystring: Schema.object().prop("products", Schema.string()),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop("data", Schema.array().items(PlanSchema)),
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
