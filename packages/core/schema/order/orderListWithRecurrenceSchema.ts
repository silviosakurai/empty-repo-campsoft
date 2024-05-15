import { Type } from "@sinclair/typebox";

export const orderListWithRecurrenceSchema = Type.Object({
  order_id: Type.String(),
  validity: Type.String({ format: "date-time" }),
  origin: Type.String(),
  recurrence: Type.String({ nullable: true }),
  price: Type.Union([Type.Number(), Type.Null()]),
  created_at: Type.String({ format: "date-time" }),
  updated_at: Type.String({ format: "date-time" }),
});
