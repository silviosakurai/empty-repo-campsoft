import { Type } from "@sinclair/typebox";
import { partnerSchema } from "./partnerSchema";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";

export const partnerListResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(partnerSchema),
});
