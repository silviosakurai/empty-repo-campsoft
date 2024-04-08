import { userResponseSchema } from "@core/schema/user/userResponseSchema";
import { Static } from "@fastify/type-provider-typebox";

export type ViewClientResponse = Static<typeof userResponseSchema>;
