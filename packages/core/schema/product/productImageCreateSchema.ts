import { Type } from "@sinclair/typebox";

export const productImageCreateSchema = Type.Object({
  image: Type.String(),
});

export const productImageCreateParamsSchema = Type.Object({
  sku: Type.String(),
  type: Type.String({ enum: ["image", "logo", "icon"] }),
});
