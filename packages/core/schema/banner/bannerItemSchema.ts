import { Type } from "@fastify/type-provider-typebox";
import { bannerItemsSchema } from "./bannerItemsSchema";

export const bannerItemSchema = Type.Object({
  banner_id: Type.Number(),
  location: Type.Union([Type.String(), Type.Null()]),
  type: Type.Union([Type.Number(), Type.Null()]),
  banner_name: Type.Union([Type.String(), Type.Null()]),
  items: Type.Array(bannerItemsSchema),
});
