import { userDetailsGroupedByCompanySchema } from "@core/schema/user/userDetailsGroupedByCompanySchema";
import { Static } from "@sinclair/typebox";

export type ClientResponse = Static<
    typeof userDetailsGroupedByCompanySchema
>;