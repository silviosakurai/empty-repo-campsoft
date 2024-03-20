import Schema from "fluent-json-schema";

const createCartSchema = {
  body: Schema.object()
    .prop("discount_coupon", Schema.integer().required())
    .prop("months", Schema.integer().minimum(0).required())
    .prop(
      "items",
      Schema.array()
        .items(
          Schema.object()
            .prop("plan_id", Schema.integer().required())
            .prop("product_id", Schema.integer().required())
        )
        .required()
    ),
};

export { createCartSchema };
