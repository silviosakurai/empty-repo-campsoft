import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";
import {
  paginationReaderSchema,
  pagingResponseSchema,
} from "@core/common/validations/pagination.validation";

const InstallmentsSchema = Schema.object()
  .prop("installment", Schema.number())
  .prop("value", Schema.number());

const CreditCardSchema = Schema.object()
  .prop("brand", Schema.string())
  .prop("number", Schema.string())
  .prop("credit_card_id", Schema.string());

const BoletoSchema = Schema.object()
  .prop("url", Schema.string())
  .prop("code", Schema.string());

const PixSchema = Schema.object()
  .prop("url", Schema.string())
  .prop("code", Schema.string())
  .prop("expire_at", Schema.string());

const OrderPaymentsSchema = Schema.object()
  .prop("type", Schema.string())
  .prop("status", Schema.string())
  .prop("credit_card", CreditCardSchema)
  .prop("voucher", Schema.string())
  .prop("boleto", BoletoSchema)
  .prop("pix", PixSchema)
  .prop("cycle", Schema.string())
  .prop("created_at", Schema.string().format("date-time"))
  .prop("updated_at", Schema.string().format("date-time"));

const PricesSchema = Schema.object()
  .prop("price", Schema.number())
  .prop("discount_value", Schema.number())
  .prop("discount_percentage", Schema.number())
  .prop("price_with_discount", Schema.number());

const TotalsOrderSchema = Schema.object()
  .prop("subtotal_price", Schema.number())
  .prop("discount_item_value", Schema.number())
  .prop("discount_coupon_value", Schema.number())
  .prop("discount_product_value", Schema.number())
  .prop("discount_percentage", Schema.number())
  .prop("total", Schema.number());

const ImagesSchema = Schema.object()
  .prop("main_image", Schema.string())
  .prop("icon", Schema.string())
  .prop("logo", Schema.string())
  .prop("background_image", Schema.string());

const ProductTypeSchema = Schema.object()
  .prop("product_type_id", Schema.number())
  .prop("product_type_name", Schema.string());

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
  .prop("status", Schema.string())
  .prop("current_expiration", Schema.string())
  .prop("expiration_date", Schema.string())
  .prop("redemption_date", Schema.string());

const AvailableProductsWithProductsSchema = Schema.object()
  .prop("product_group_id", Schema.number())
  .prop("name", Schema.string())
  .prop("quantity", Schema.number())
  .prop("selected_products", Schema.array().items(ProductDetailSchema));

const PlanDetailsWithProductsSchema = Schema.object()
  .prop("plan_id", Schema.number())
  .prop("visible_site", Schema.boolean())
  .prop("business_id", Schema.number())
  .prop("plan", Schema.string())
  .prop("image", Schema.string())
  .prop("description", Schema.string())
  .prop("short_description", Schema.string())
  .prop("status", Schema.string())
  .prop("prices", Schema.array().items(PricesSchema))
  .prop("plan_products", Schema.array().items(ProductDetailSchema))
  .prop(
    "product_groups",
    Schema.array().items(AvailableProductsWithProductsSchema)
  );

const ListOrderResponseSchema = Schema.object()
  .prop("order_id", Schema.string())
  .prop("client_id", Schema.string())
  .prop("seller_id", Schema.string())
  .prop("status", Schema.string())
  .prop("totals", TotalsOrderSchema)
  .prop("installments", InstallmentsSchema)
  .prop("payments", Schema.array().items(OrderPaymentsSchema))
  .prop("products", Schema.array().items(ProductDetailSchema))
  .prop("plans", Schema.array().items(PlanDetailsWithProductsSchema))
  .prop("created_at", Schema.string().format("date-time"))
  .prop("updated_at", Schema.string().format("date-time"));

export const ListOrderResponseDtoSchema = Schema.object()
  .prop("results", Schema.array().items(ListOrderResponseSchema))
  .extend(pagingResponseSchema);

export const ordersSchema = {
  description: "Seleciona todos os pedidos do usuário",
  tags: [TagSwagger.order],
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
  querystring: Schema.object().extend(paginationReaderSchema),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop("data", ListOrderResponseDtoSchema),
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
