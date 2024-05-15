import { Type } from "@sinclair/typebox";
import { orderListSchema } from "./orderListSchema";

export const orderListWithRecurrenceResponseSchema = Type.Object({
  results: Type.Array(orderListSchema),
});
