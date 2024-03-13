import Schema from "fluent-json-schema";

const loginSchema = {
  body: Schema.object()
    .prop("login", Schema.string().required())
    .prop("password", Schema.string().minLength(6).required()),
};

const loginTokenSchema = {
  body: Schema.object().prop("login_token", Schema.string().required()),
};

export { loginSchema, loginTokenSchema };
