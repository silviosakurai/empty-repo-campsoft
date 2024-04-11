import { Type } from "@sinclair/typebox";

export const pricesProductSchema = Type.Object({
  face_value: Type.Number(),
  price: Type.Number(),
});
