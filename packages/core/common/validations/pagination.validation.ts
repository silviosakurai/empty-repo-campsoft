import Schema from "fluent-json-schema";
import { IPaginationQueryString } from "../interfaces/IPaginationQueryString";

const paginationReaderSchema = Schema.object<IPaginationQueryString>()
  .prop("current_page", Schema.number().minimum(1).default(1).required())
  .prop(
    "per_page",
    Schema.number().minimum(1).maximum(200).default(10).required()
  );

const pagingResponseSchema = Schema.object().prop(
  "paging",
  Schema.object()
    .prop("current_page", Schema.number())
    .prop("total_pages", Schema.number())
    .prop("per_page", Schema.number())
    .prop("count", Schema.number())
    .prop("total", Schema.number())
);

export { paginationReaderSchema, pagingResponseSchema };
