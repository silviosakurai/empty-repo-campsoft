import { Type } from "@sinclair/typebox";

export const companySchema = Type.Object({
  company_id: Type.Number(),
  company_name: Type.Union([Type.String(), Type.Null()]),
});
