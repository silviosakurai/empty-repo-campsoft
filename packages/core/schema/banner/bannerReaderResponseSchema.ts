import { Type } from "@fastify/type-provider-typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { bannerItemSchema } from "./bannerItemSchema";

export const bannerReaderResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(bannerItemSchema),
});
