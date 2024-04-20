import { Type } from "@sinclair/typebox";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const userByIdResponseWithCompaniesSchema = Type.Object({
  user_id: Type.String({ format: "uuid" }),
  status: Type.String({ enum: Object.values(ClientStatus) }),
  first_name: Type.String(),
  last_name: Type.String(),
  birthday: Type.String(),
  email: Type.String(),
  phone: Type.String(),
  cpf: Type.String(),
  gender: Type.String({ enum: Object.values(ClientGender) }),
  companies: Type.Array(
    Type.Object({
      company_id: Type.Number(),
      company_name: Type.String(),
      user_type: Type.Number(),
      leader_id: Type.String(),
    })
  ),
});
