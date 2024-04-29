import { Type } from "@sinclair/typebox";

export const productGroupImageCreateParamsSchema = Type.Object({
  groupId: Type.Number(),
  type: Type.String({ enum: ["icon"] }),
});

export const productGroupImageCreateBodySchema = Type.Object({
  image: Type.String(),
});
