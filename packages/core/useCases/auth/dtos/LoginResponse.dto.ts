import { PermissionFindByCliendId } from "@core/interfaces/repositories/permission";
import { loginResponseManagerSchema } from "@core/schema/login/loginResponseManagerSchema";
import { loginResponseSchema } from "@core/schema/login/loginResponseSchema";
import { Static } from "@fastify/type-provider-typebox";

export type LoginResponse = Static<typeof loginResponseSchema>;

export type LoginCompleteResponse =  { 
  auth: LoginResponse,
  permissions: PermissionFindByCliendId[]
};
export type LoginResponseManager = Static<typeof loginResponseManagerSchema>;
