import { userByIdResponseWithCompaniesSchema } from "@core/schema/user/userByIdResponseWithCompaniesSchema";
import { Static } from "@fastify/type-provider-typebox";

export type ViewClientByIdResponse = Static<
  typeof userByIdResponseWithCompaniesSchema
>;
