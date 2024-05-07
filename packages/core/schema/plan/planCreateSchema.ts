import { Type } from "@sinclair/typebox";
import { pricesMonthSchema } from "../price/pricesMonthSchema";

export const planCreateSchema = Type.Object({
  visible_site: Type.Boolean(),
  business_id: Type.Number(),
  plan: Type.String(),
  description: Type.String(),
  short_description: Type.String(),
  prices: Type.Array(pricesMonthSchema),
  products: Type.Array(Type.String()),
  product_groups: Type.Array(Type.String()),
});
