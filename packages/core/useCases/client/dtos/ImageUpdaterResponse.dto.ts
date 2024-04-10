import { userUploadImageSchemaResponse } from "@core/schema/user/userUploadImageSchema";
import { Static } from "@sinclair/typebox";

export type ImageUpdaterResponse = Static<typeof userUploadImageSchemaResponse>;
