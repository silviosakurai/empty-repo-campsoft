import { userCreatorResponseSchema } from "@core/schema/user/userCreatorResponseSchema";
import { Static } from "@sinclair/typebox";

export type CreateClientResponse = Static<typeof userCreatorResponseSchema>;
