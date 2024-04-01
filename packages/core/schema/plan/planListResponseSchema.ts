import { Type } from "@sinclair/typebox";
import { planDetailsWithProductsAvailableSchema } from "./planDetailsWithProductsAvailableSchema";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";

export const planListResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(planDetailsWithProductsAvailableSchema),
});
