import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { productDetailsWithPricesAndDatesGroupedByCompanySchema } from "./productDetailsWithPricesAndDatesGroupedByCompany";

export const productListGroupedByCompanyResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(productDetailsWithPricesAndDatesGroupedByCompanySchema),
});
