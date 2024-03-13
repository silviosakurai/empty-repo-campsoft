import Schema from "fluent-json-schema";
import { ProductFieldsToOrder, ProductStatus } from "@core/common/enums/models/product";
import { SortOrder } from "@core/common/enums/SortOrder";

const listProductSchema = {
  querystring: Schema.object()
    .prop("id", Schema.string())
    .prop("status", Schema.string().enum(Object.values(ProductStatus)).default(ProductStatus.ACTIVE))
    .prop("name", Schema.string())
    .prop("description", Schema.string())
    .prop("productType", Schema.string())
    .prop("slug", Schema.string())
    .prop("sort_by", Schema.string().enum(Object.keys(ProductFieldsToOrder)))
    .prop("sort_order", Schema.string().enum(Object.values(SortOrder)))
    .prop("per_page", Schema.number().default(10))
    .prop("current_page", Schema.number().default(1))
};

export {
  listProductSchema,
};
