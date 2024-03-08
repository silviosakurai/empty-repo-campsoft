import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { FastifyRedis } from "@fastify/redis";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { RouteModule } from "@core/common/enums/models/route";
import { ViewApiTfaResponse } from "@core/useCases/api/dtos/ViewApiTfaResponse.dto";

declare module "fastify" {
  export interface FastifyInstance {
    db: MySql2Database<typeof schema>;
    redis: FastifyRedis;
    authenticateKeyApi: (request: FastifyRequest, reply: FastifyReply) => void;
    authenticateJwt: (request: FastifyRequest, reply: FastifyReply) => void;
    authenticateTfa: (request: FastifyRequest, reply: FastifyReply) => void;
    decodeToken: (token: string) => Promise<null | string | object>;
  }

  export interface FastifyRequest {
    apiAccess: ViewApiResponse;
    tfaInfo: ViewApiTfaResponse;
    module: RouteModule;
  }
}
