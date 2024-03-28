import Schema from "fluent-json-schema";
import { Language } from "@core/common/enums/Language";
import { TagSwagger } from "@core/common/enums/TagSwagger";

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

export const getPaymentsSchema = {
  description: "Seleciona as formas de pagamento de um pedido",
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
  params: Schema.object().prop("orderNumber", Schema.string().required()),
  response: {
    200: Schema.object()
      .description("Successful")
      .prop("status", Schema.boolean())
      .prop("message", Schema.string())
      .prop("data", Schema.array().items(OrderPaymentsSchema)),
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
