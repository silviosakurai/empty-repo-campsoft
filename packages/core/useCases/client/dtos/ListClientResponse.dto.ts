import { userDetailsGroupedByCompanySchema } from "@core/schema/user/userDetailsGroupedByCompanySchema";
import { userListGroupedByCompanyResponseSchema } from "@core/schema/user/userListGroupedByCompanyResponseSchema";
import { userResponseWithCompaniesSchema } from "@core/schema/user/userResponseWithCompaniesSchema";
import { Static } from "@sinclair/typebox";
import { ClientResponse } from "./ClientResponse.dto";

export interface ListClientResult {
  results: ClientResponse[];
}

export type ListClientResponse = Static<typeof userResponseWithCompaniesSchema>;
export type ListClientGroupedByCompany = Static<
  typeof userDetailsGroupedByCompanySchema
>;
export type ListClienttGroupedByCompanyResponse = Static<
  typeof userListGroupedByCompanyResponseSchema
>;
