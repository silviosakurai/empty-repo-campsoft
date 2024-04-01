import { Type } from "@fastify/type-provider-typebox";

export const bannerItemImageSchema = Type.Object({
  desktop: Type.String({ format: "uri" }),
  mobile: Type.String({ format: "uri" }),
});
