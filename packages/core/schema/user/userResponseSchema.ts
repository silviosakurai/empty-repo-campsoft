import { Type } from "@sinclair/typebox";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const userResponseSchema = Type.Object({
  client_id: Type.String({ format: "uuid" }),
  status: Type.String({ enum: Object.values(ClientStatus) }),
  first_name: Type.String(),
  last_name: Type.String(),
  birthday: Type.String({ format: "date-time" }),
  email: Type.String({ format: "email" }),
  phone: Type.String(),
  cpf: Type.String(),
  gender: Type.String({ enum: Object.values(ClientGender) }),
  obs: Type.String(),
});
