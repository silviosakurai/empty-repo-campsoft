import { Gender, Status } from "@core/common/enums/models/client";
import Schema from "fluent-json-schema";

const userCreatorSchema = {
  body: Schema.object()
    .prop("status", Schema.enum(Object.values(Status)).required())
    .prop("first_name", Schema.string().required())
    .prop("last_name", Schema.string().required())
    .prop("birthday", Schema.string().format("date").required())
    .prop("email", Schema.string().format("email").required())
    .prop("phone", Schema.string().minLength(11).maxLength(12).required())
    .prop("cpf", Schema.string().minLength(11).maxLength(11).required())
    .prop("password", Schema.string().minLength(6).required())
    .prop("gender", Schema.enum(Object.values(Gender)).required())
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

export { userCreatorSchema, userReaderSchema, userViewSchema };
