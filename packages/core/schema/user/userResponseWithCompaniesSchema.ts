import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const userResponseWithCompaniesSchema = Type.Object({
  ...pagingResponseSchema.properties,
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
      leader_id: Type.String(),
    })
  ),
});
