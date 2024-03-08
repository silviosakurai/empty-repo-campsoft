import Schema from "fluent-json-schema";

const paginationReaderSchema = Schema.object()
  .prop("current_page", Schema.number().required())
  .prop("per_page", Schema.number().required());

export { paginationReaderSchema };
