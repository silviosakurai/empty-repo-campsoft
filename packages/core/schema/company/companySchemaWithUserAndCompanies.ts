import { Type } from "@sinclair/typebox";

export const companySchemaWithUserAndCompanies = Type.Object({
  company_id: Type.Union([Type.Number(), Type.Null()]),
  company_name: Type.Union([Type.String(), Type.Null()]),
  position_id: Type.Number(),
  position_name: Type.String(),
});
