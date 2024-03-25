import { paginationReaderSchema } from "@core/common/validations/pagination.validation";
import Schema from "fluent-json-schema";

const ordersSchema = {
  querystring: Schema.object().extend(paginationReaderSchema),
};

export { ordersSchema };
