import { paginationReaderSchema } from "@core/common/validations/pagination.validation";
import Schema from "fluent-json-schema";

const ordersSchema = {
  querystring: Schema.object().extend(paginationReaderSchema),
};

const getPayments = {
  params: Schema.object().prop("orderNumber", Schema.string().required()),
};

export {
  ordersSchema,
  getPayments,
};
