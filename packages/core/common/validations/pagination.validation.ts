import Schema from "fluent-json-schema";
import { IPaginationQueryString } from "../interfaces/IPaginationQueryString";

const paginationReaderSchema = Schema.object<IPaginationQueryString>()
  .prop("current_page", Schema.number().required())
  .prop("per_page", Schema.number().required());

export { paginationReaderSchema };
