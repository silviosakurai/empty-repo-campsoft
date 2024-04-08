import { Type } from "@sinclair/typebox";
import { pagingResponseSchema } from "../paging/pagingResponseSchema";
import { productDetailHowToAccessWithDatesSchema } from "./productDetailHowToAccessWithDatesSchema";

export const productListResponseSchema = Type.Object({
  ...pagingResponseSchema.properties,
  results: Type.Array(productDetailHowToAccessWithDatesSchema),
});
