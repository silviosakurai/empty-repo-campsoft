import Schema from "fluent-json-schema";
import { Status } from "@core/common/enums/Status";
import { SortOrder } from "@core/common/enums/SortOrder";
import { ProductFieldsToOrder } from "@core/common/enums/models/product";

const listProductSchema = {
  querystring: Schema.object()
    .prop("id", Schema.string())
    .prop("status", Schema.string().enum(Object.values(Status)).default(Status.ACTIVE))
    .prop("name", Schema.string())
    .prop("description", Schema.string())
    .prop("product_type", Schema.string())
    .prop("slug", Schema.string())
    .prop("sort_by", Schema.string().enum(Object.keys(ProductFieldsToOrder)))
    .prop("sort_order", Schema.string().enum(Object.values(SortOrder)))
    .prop("per_page", Schema.number().default(10))
    .prop("current_page", Schema.number().default(1))
};

const getProduct = {
  params: Schema.object().prop("sku", Schema.string().required()),
};

export {
  listProductSchema,
  getProduct,
};
