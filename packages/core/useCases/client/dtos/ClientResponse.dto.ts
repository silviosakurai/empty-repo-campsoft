import { userDetailsGroupedByCompanySchema } from "@core/schema/user/userDetailsGroupedByCompanySchema";
import { userReponseWithCompaniesSchema } from "@core/schema/user/userResponseWithCompaniesSchema";
import { Static } from "@sinclair/typebox";

export type ClientResponse = Static<
    typeof userDetailsGroupedByCompanySchema
>;