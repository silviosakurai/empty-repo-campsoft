import { ClientGender, ClientStatus } from "@core/common/enums/models/client";
import { Type } from "@sinclair/typebox";
import { companySchemaWithUserAndSellers } from "../company/companySchemaWithUserAndSellers";
import { companySchemaWithUserAndCompanies } from "../company/companySchemaWithUserAndCompanies";

export const userDetailsGroupedByCompanySchema = Type.Object({
  user_id: Type.String({ format: "uuid" }),
  status: Type.String({ enum: Object.values(ClientStatus) }),
  name: Type.Union([Type.String(), Type.Null()]),
  first_name: Type.Union([Type.String(), Type.Null()]),
  last_name: Type.Union([Type.String(), Type.Null()]),
  birthday: Type.String(),
  email: Type.Union([Type.String(), Type.Null()]),
  phone: Type.String(),
  cpf: Type.Union([Type.String(), Type.Null()]),
  gender: Type.Union([
    Type.String({ enum: Object.values(ClientGender) }),
    Type.Null(),
  ]),
  photo: Type.Union([Type.String(), Type.Null()]),
  sellers: Type.Array(companySchemaWithUserAndSellers),
  companies: Type.Array(companySchemaWithUserAndCompanies),
});
