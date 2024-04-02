import { Type } from "@fastify/type-provider-typebox";

export const pagingResponseSchema = Type.Object(
  {
    paging: Type.Object({
      current_page: Type.Number(),
      total_pages: Type.Number(),
      per_page: Type.Number(),
      count: Type.Number(),
      total: Type.Number(),
    }),
  },
  { additionalProperties: false }
);
