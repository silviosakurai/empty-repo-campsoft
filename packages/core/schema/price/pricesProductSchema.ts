import { Type } from "@sinclair/typebox";

export const pricesProductSchema = Type.Object({
  face_value: Type.Union([Type.Number(), Type.Null()]),
  price: Type.Union([Type.Number(), Type.Null()]),
});
