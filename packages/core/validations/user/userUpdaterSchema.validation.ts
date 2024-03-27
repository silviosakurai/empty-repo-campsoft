import { Language } from "@core/common/enums/Language";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const userUpdaterSchema = {
  description: "Atualiza os dados de um usuário logado",
  tags: ["user"],
  operationId: "putUser",
  produces: ["application/json"],
  security: [
    {
      keyapi: [],
      bearerAuth: [],
    },
  ],
  headers: {
    type: "object",
    properties: {
      "Accept-Language": {
        type: "string",
        description: "Idioma preferencial para a resposta",
        enum: Object.values(Language),
        default: Language.pt,
      },
    },
  },
  body: {
    type: "object",
    properties: {
      status: { type: "string", enum: Object.values(ClientStatus) },
      first_name: { type: "string" },
      last_name: { type: "string" },
      birthday: { type: "string", format: "date" },
      gender: { type: "string", enum: Object.values(ClientGender) },
      obs: { type: "string" },
    },
    required: ["status", "first_name", "last_name", "birthday", "gender"],
  },
  response: {
    200: {
      description: "Successful",
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        data: { type: "null" },
      },
    },
    401: {
      description: "Unauthorized",
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        data: { type: "null" },
      },
    },
  },
};
