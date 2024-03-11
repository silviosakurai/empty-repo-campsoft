import { TFAType } from "@core/common/enums/models/tfa";
import Schema from "fluent-json-schema";

const sendCode = {
  body: Schema.object()
    .prop("type", Schema.string().required().enum(Object.values(TFAType)))
    .prop("login", Schema.string().required()),
};

const validateCode = {
  body: Schema.object()
    .prop("login", Schema.string().required())
    .prop("code", Schema.string().required()),
};

export { sendCode, validateCode };
