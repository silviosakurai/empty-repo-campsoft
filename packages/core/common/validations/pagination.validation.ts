import Schema from "fluent-json-schema";
import { IPaginationQueryString } from "../interfaces/IPaginationQueryString";

const paginationReaderSchema = Schema.object<IPaginationQueryString>()
  .prop("current_page", Schema.number().minimum(0).required())
  .prop("per_page", Schema.number().minimum(0).maximum(200).required());

export { paginationReaderSchema };
