import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { productDetailsWithPricesAndDatesSchema } from "./productDetailsWithPricesAndDatesSchema";

export const productListWithPricesResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(productDetailsWithPricesAndDatesSchema),
});
