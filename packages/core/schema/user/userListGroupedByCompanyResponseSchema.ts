import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { userDetailsGroupedByCompanySchema } from "./userDetailsGroupedByCompanySchema";

export const userListGroupedByCompanyResponseSchema = Type.Object({
    ...pagingResponseSchema.properties,
    results: Type.Array(userDetailsGroupedByCompanySchema),
});