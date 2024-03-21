import Schema from "fluent-json-schema";

const createCartSchema = {
  body: Schema.object()
    .prop("discount_coupon", Schema.integer())
    .prop("months", Schema.integer().minimum(0))
    .prop("plans_id", Schema.array().items(Schema.number()).required())
    .prop("products_id", Schema.array().items(Schema.string())),
};

export { createCartSchema };
