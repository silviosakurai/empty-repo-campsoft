import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { productDetailsWithPricesAndDatesGroupedByPartnerSchema } from "./productDetailsWithPricesAndDatesGroupedByPartner";

export const productListGroupedByPartnerResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(productDetailsWithPricesAndDatesGroupedByPartnerSchema),
});
