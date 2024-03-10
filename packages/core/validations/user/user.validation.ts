import { ClientGender, ClientStatus } from "@core/common/enums/models/client";
import Schema from "fluent-json-schema";

const userCreatorSchema = {
  body: Schema.object()
    .prop("status", Schema.enum(Object.values(ClientStatus)).required())
    .prop("first_name", Schema.string().required())
    .prop("last_name", Schema.string().required())
    .prop("birthday", Schema.string().format("date").required())
    .prop("email", Schema.string().format("email").required())
    .prop("phone", Schema.string().minLength(11).maxLength(12).required())
    .prop("cpf", Schema.string().minLength(11).maxLength(11).required())
    .prop("password", Schema.string().minLength(6).required())
    .prop("gender", Schema.enum(Object.values(ClientGender)).required())
    .prop("obs", Schema.string()),
};

const userReaderSchema = {
  querystring: Schema.object()
    .prop("current_page", Schema.number().required())
    .prop("per_page", Schema.number().required())
    .prop("text_search", Schema.string()),
};

const userViewSchema = {
  params: Schema.object().prop(
    "userId",
    Schema.string().format("uuid").required()
  ),
};

const userUpdaterSchema = {
  body: Schema.object()
    .prop("status", Schema.enum(Object.values(ClientStatus)).required())
    .prop("first_name", Schema.string().required())
    .prop("last_name", Schema.string().required())
    .prop("birthday", Schema.string().format("date").required())
    .prop("gender", Schema.enum(Object.values(ClientGender)).required())
    .prop("obs", Schema.string()),
};

const userPhoneUpdaterSchema = {
  body: Schema.object().prop("phone", Schema.string().required()),
};

const userPasswordRecoveryMethods = {
  params: Schema.object().prop("login", Schema.string().required()),
};

const userPasswordUpdaterSchema = {
  body: Schema.object().prop("new_password", Schema.string().required()),
};

export {
  userCreatorSchema,
  userReaderSchema,
  userViewSchema,
  userUpdaterSchema,
  userPhoneUpdaterSchema,
  userPasswordRecoveryMethods,
  userPasswordUpdaterSchema,
};
