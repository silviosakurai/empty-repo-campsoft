import { Language } from "@core/common/enums/Language";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const userCreatorSchema = {
  description: "Cria um novo usuário",
  tags: ["user"],
  operationId: "postUser",
  produces: ["application/json"],
  security: [
    {
      keyapi: [],
      tokentfa: [],
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
      email: { type: "string", format: "email" },
      phone: { type: "string" },
      cpf: { type: "string" },
      password: { type: "string" },
      gender: { type: "string", enum: Object.values(ClientGender) },
      obs: { type: "string" },
    },
    required: [
      "status",
      "first_name",
      "last_name",
      "birthday",
      "email",
      "phone",
      "cpf",
      "password",
      "gender",
    ],
  },
  response: {
    200: {
      description: "Successful",
      type: "object",
      properties: {
        status: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
          },
        },
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
