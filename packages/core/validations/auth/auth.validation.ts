import Schema from "fluent-json-schema";

const loginSchema = {
  body: Schema.object()
    .prop("login", Schema.string().required())
    .prop("password", Schema.string().minLength(6).required()),
};

export { loginSchema };
