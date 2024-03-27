import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import { ProductVoucherStatus } from "@core/common/enums/models/product";

const ProductTypeSchema = Schema.object()
  .prop("product_type_id", Schema.number())
  .prop("product_type_name", Schema.string());

const ImagesSchema = Schema.object()
  .prop("main_image", Schema.string())
  .prop("icon", Schema.string())
  .prop("logo", Schema.string())
  .prop("background_image", Schema.string());

const ProductDetailSchema = Schema.object()
  .prop("product_id", Schema.string())
  .prop("name", Schema.string())
  .prop("long_description", Schema.string())
  .prop("short_description", Schema.string())
  .prop("marketing_phrases", Schema.string())
  .prop("content_provider_name", Schema.string())
  .prop("slug", Schema.string())
  .prop("images", ImagesSchema)
  .prop("product_type", ProductTypeSchema)
  .prop("status", Schema.string().enum(Object.values(ProductVoucherStatus)))
  .prop("current_expiration", Schema.string().format("date-time"))
  .prop("expiration_date", Schema.string().format("date-time"))
  .prop("redemption_date", Schema.string().format("date-time"));

const AvailableProductsSchema = Schema.object()
  .prop("product_group_id", Schema.number())
  .prop("name", Schema.string())
  .prop("quantity", Schema.number())
  .prop("available_products", Schema.array().items(ProductDetailSchema));

const PlanDetailsWithProductsSchema = Schema.object()
  .prop("plan_id", Schema.number())
  .prop("visible_site", Schema.boolean())
  .prop("business_id", Schema.number())
  .prop("plan", Schema.string())
  .prop("image", Schema.string())
  .prop("description", Schema.string())
  .prop("short_description", Schema.string())
  .prop("status", Schema.string().enum(Object.values(ProductVoucherStatus)))
  .prop("current_expiration", Schema.string().format("date-time"))
  .prop("expiration_date", Schema.string().format("date-time"))
  .prop("redemption_date", Schema.string().format("date-time"))
  .prop("plan_products", Schema.array().items(ProductDetailSchema))
  .prop("product_groups", Schema.array().items(AvailableProductsSchema));

export const getUserVoucherSchema = {
  description: "Obtém informações do voucher do usuário",
  tags: [TagSwagger.user],
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
  params: Schema.object().prop("voucherCode", Schema.string().required()),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop(
        "data",
        Schema.object()
          .prop("products", Schema.array().items(ProductDetailSchema))
          .prop("plans", Schema.array().items(PlanDetailsWithProductsSchema))
      ),
    400: Schema.object()
      .description("Bad Request")
      .prop("status", Schema.boolean().default(false))
      .prop("message", Schema.string())
      .prop("data", Schema.null()),
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
