import { Type } from "@sinclair/typebox";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const loginResponseSchema = Type.Object({
  client_id: Type.String({ format: "uuid" }),
  status: Type.String({ enum: Object.values(ClientStatus) }),
  facebook_id: Type.Integer(),
  name: Type.String(),
  surname: Type.String(),
  birth_date: Type.String({ format: "date" }),
  email: Type.String({ format: "email" }),
  phone: Type.String(),
  cpf: Type.String(),
  gender: Type.String({ enum: Object.values(ClientGender) }),
});