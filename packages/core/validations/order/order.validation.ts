import Schema from "fluent-json-schema";

const ordersSchema = {
  querystring: Schema.object()
    .prop("current_page", Schema.number().required())
    .prop("per_page", Schema.number().required()),
};

export { ordersSchema };
