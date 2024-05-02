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
  photo: Type.String(),
  obs: Type.String(),
  sellers: Type.Array(
    Type.Object({
      company_id: Type.Number(),
      company_name: Type.String(),
      seller_id: Type.String(),
    })
  ),
  companies: Type.Array(
    Type.Object({
      company_id: Type.Number(),
      company_name: Type.String(),
      position_id: Type.Number(),
      position_name: Type.String(),
    })
  ),
});
