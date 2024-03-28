import { paginationReaderSchema } from "@core/common/validations/pagination.validation";
import Schema from "fluent-json-schema";

const ordersSchema = {
  querystring: Schema.object().extend(paginationReaderSchema),
};

const ordersByNumberParamSchema = {
  params: Schema.object().prop(
    "orderNumber",
    Schema.string().format("uuid").required()
  ),
};

export { ordersSchema, ordersByNumberParamSchema };
