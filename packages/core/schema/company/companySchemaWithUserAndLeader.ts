import { Type } from "@sinclair/typebox";

export const companySchemaWithUserAndLeader = Type.Object({
  company_id: Type.Number(),
  company_name: Type.Union([Type.String(), Type.Null()]),
  seller_id: Type.String(),
});
