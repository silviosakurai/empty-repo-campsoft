import { Type } from "@sinclair/typebox";

export const userCreatorResponseSchema = Type.Object({
  user_id: Type.String({ format: "uuid" }),
});
