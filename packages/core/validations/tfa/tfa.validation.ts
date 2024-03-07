import Schema from "fluent-json-schema";
import { TFAType } from "@core/common/enums/TFAType";

const sendCode = {
  body: Schema.object()
    .prop("type", Schema.string().required().enum(Object.values(TFAType)))
    .prop("login", Schema.string().required()),
};

export { sendCode };
