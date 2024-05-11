import { Type } from "@sinclair/typebox";

export const companySchema = Type.Object({
  company_id: Type.Union([Type.Number(), Type.Null()]),
  company_name: Type.Union([Type.String(), Type.Null()]),
});
