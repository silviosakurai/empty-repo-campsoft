import { ClientGender, ClientStatus } from "@core/common/enums/models/client";
import { Type } from "@sinclair/typebox";
import { companySchemaWithUserAndLeader } from "../company/companySchemaWithUserAndLeader";

export const userDetailsGroupedByCompanySchema = Type.Object({
    user_id: Type.String({ format: "uuid" }),
    status: Type.String({ enum: Object.values(ClientStatus) }),
    name: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
    birthday: Type.String(),
    email: Type.String(),
    phone: Type.String(),
    cpf: Type.String(),
    gender: Type.String({ enum: Object.values(ClientGender) }),
    companies: Type.Array(companySchemaWithUserAndLeader),
})