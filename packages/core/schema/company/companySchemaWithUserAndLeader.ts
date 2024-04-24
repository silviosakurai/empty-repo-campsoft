import { Type } from "@sinclair/typebox";

export const companySchemaWithUserAndLeader = Type.Object({
  company_id: Type.Number(),
  company_name: Type.String(),
  leader_id: Type.Optional(Type.String()),
});
