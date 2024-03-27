import { paginationReaderSchema } from "@core/common/validations/pagination.validation";
import Schema from "fluent-json-schema";

const userReaderSchema = {
  querystring: Schema.object()
    .prop("text_search", Schema.string())
    .extend(paginationReaderSchema),
};

const userPhoneUpdaterSchema = {
  body: Schema.object().prop("phone", Schema.string().required()),
};

const userPasswordUpdaterSchema = {
  body: Schema.object()
    .prop("current_password", Schema.string().required())
    .prop("new_password", Schema.string().required()),
};

const userPasswordRecoveryMethods = {
  params: Schema.object().prop("login", Schema.string().required()),
};

const userPasswordRecoveryUpdaterSchema = {
  body: Schema.object().prop("new_password", Schema.string().required()),
};

export {
  userReaderSchema,
  userPhoneUpdaterSchema,
  userPasswordUpdaterSchema,
  userPasswordRecoveryMethods,
  userPasswordRecoveryUpdaterSchema,
};
