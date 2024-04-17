import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { ClientGender, ClientStatus } from "@core/common/enums/models/client";

export const userReponseWithCompaniesSchema = Type.Object({
  ...pagingResponseSchema.properties,
  user_id: Type.String({ format: "uuid" }),
  status: Type.String({ enum: Object.values(ClientStatus) }),
  first_name: Type.String(),
  last_name: Type.String(),
  companies: Type.Array(Type.Object({
    company_id: Type.Number(),
    company_name: Type.String(),
    user_type: Type.Number(),
    leader_id: Type.String()
  }))
})