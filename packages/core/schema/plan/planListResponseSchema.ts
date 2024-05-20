import { Type } from "@sinclair/typebox";
import { planDetailsWithProductsAvailableSchema } from "./planDetailsWithProductsAvailableSchema";

export const planListResponseSchema = Type.Object({
  planDetailsWithProductsAvailableSchema,
});
