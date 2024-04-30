import { Type } from "@fastify/type-provider-typebox";

export const bannerCreatorRequestSchema = Type.Object({
  business_id: Type.Number(),
  location: Type.String(),
  type: Type.Number(),
  banner_name: Type.String(),
});
