import { Language } from "@core/common/enums/Language";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const getUserSchema = {
  description: "Seleciona os dados do usuário logado",
  tags: ["user"],
  operationId: "getUser",
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
            client_id: { type: "string", format: "uuid" },
            status: { type: "string", enum: Object.values(ClientStatus) },
            first_name: { type: "string" },
            last_name: { type: "string" },
            birthday: { type: "string", format: "date-time" },
            email: { type: "string", format: "email" },
            phone: { type: "string" },
            cpf: { type: "string" },
            gender: { type: "string", enum: Object.values(ClientGender) },
            obs: { type: "string" },
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
