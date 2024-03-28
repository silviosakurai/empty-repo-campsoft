import { Type } from "@fastify/type-provider-typebox";
import { bannerItemImageSchema } from "./bannerItemImageSchema";

export const bannerItemsSchema = Type.Object({
  banner_id: Type.Number(),
  item_id: Type.Number(),
  item_name: Type.String(),
  description: Type.String(),
  sort: Type.Number(),
  format: Type.String(),
  images: bannerItemImageSchema,
  html: Type.String(),
  link: Type.String({ format: "uri" }),
  start_date: Type.String({ format: "date-time" }),
  end_date: Type.String({ format: "date-time" }),
});
