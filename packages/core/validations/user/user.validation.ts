import Schema from "fluent-json-schema";

const userCreatorSchema = {
  body: Schema.object()
    .prop("status", Schema.string().required())
    .prop("first_name", Schema.string().required())
    .prop("last_name", Schema.string().required())
    .prop("birthday", Schema.string().format("date").required())
    .prop("email", Schema.string().format("email").required())
    .prop("phone", Schema.string().minLength(11).maxLength(12).required())
    .prop("cpf", Schema.string().minLength(11).maxLength(11).required())
    .prop("password", Schema.string().minLength(6).required())
    .prop("gender", Schema.string().required())
    .prop("obs", Schema.string())
    .prop("tfa_token", Schema.string().required()),
};

const userReaderSchema = {
  querystring: Schema.object()
    .prop("current_page", Schema.number().required())
    .prop("per_page", Schema.number().required())
    .prop("text_search", Schema.string()),
};

export { userCreatorSchema, userReaderSchema };
