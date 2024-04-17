import { userDetailsGroupedByCompanySchema } from "@core/schema/user/userDetailsGroupedByCompanySchema";
import { userListGroupedByCompanyResponseSchema } from "@core/schema/user/userListGroupedByCompanyResponseSchema";
import { userReponseWithCompaniesSchema } from "@core/schema/user/userResponseWithCompaniesSchema";
import { Static } from "@sinclair/typebox";
import { ClientResponse } from "./ClientResponse.dto";

export interface ListClientResult {
    results: ClientResponse[]
}

export type ListClientResponse = Static<typeof userReponseWithCompaniesSchema>;
export type ListClientGroupedByCompany = Static<typeof userDetailsGroupedByCompanySchema>;
export type ListClienttGroupedByCompanyResponse = Static<typeof userListGroupedByCompanyResponseSchema>;


