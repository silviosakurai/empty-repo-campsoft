import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { orderListSchema } from "./orderListSchema";

export const orderListResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(orderListSchema),
});
