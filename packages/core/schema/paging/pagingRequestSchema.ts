import { Type } from "@fastify/type-provider-typebox";

export const pagingRequestSchema = Type.Object(
  {
    current_page: Type.Number({ minimum: 1, default: 1 }),
    per_page: Type.Number({ minimum: 1, maximum: 200, default: 10 }),
  },
  { additionalProperties: false }
);
