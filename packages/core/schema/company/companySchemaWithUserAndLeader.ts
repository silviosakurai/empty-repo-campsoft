import { Type } from "@sinclair/typebox";

export const companySchemaWithUserAndLeader = Type.Object({
    company_id: Type.Number(),
    company_name: Type.String(),
    user_type: Type.Number(),
    leader_id: Type.Optional(Type.String())
});
