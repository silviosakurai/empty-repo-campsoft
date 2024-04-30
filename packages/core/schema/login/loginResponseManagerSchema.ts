import { Type } from "@sinclair/typebox";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const loginResponseManagerSchema = Type.Object({
  client_id: Type.String({ format: "uuid" }),
  status: Type.String({ enum: Object.values(ClientStatus) }),
  name: Type.String(),
  surname: Type.String(),
  birth_date: Type.String({ format: "date" }),
  email: Type.String({ format: "email" }),
  phone: Type.String(),
  cpf: Type.String(),
  gender: Type.String({ enum: Object.values(ClientGender) }),
  photo: Type.Union([Type.String(), Type.Null()]),
});
