import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { FastifyRedis } from "@fastify/redis";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";
import { RouteModule } from "@core/common/enums/models/route";

declare module "fastify" {
  export interface FastifyInstance {
    db: MySql2Database<typeof schema>;
    redis: FastifyRedis;
    authenticateKeyApi: (request: FastifyRequest, reply: FastifyReply) => void;
    authenticateJwt: (request: FastifyRequest, reply: FastifyReply) => void;
  }

  export interface FastifyRequest {
    apiAccess: ViewApiResponse;
    module: RouteModule;
  }
}
