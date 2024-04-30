import { Type } from "@fastify/type-provider-typebox";

export const bannerUpdaterResponseSchema = Type.Object({
  location: Type.String(),
  type: Type.Number(),
  banner_name: Type.String(),
});
