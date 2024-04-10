import { Type } from "@sinclair/typebox";

export const userUploadImageSchemaRequest = Type.Object({
  image: Type.String(),
});

export const userUploadImageSchemaResponse = Type.Object({
  client_id: Type.String(),
  image: Type.String(),
});
