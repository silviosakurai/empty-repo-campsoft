import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { FastifyRedis } from "@fastify/redis";
import { ViewApiResponse } from "@core/useCases/api/dtos/ViewApiResponse.dto";

declare module "fastify" {
  export interface FastifyInstance {
    db: MySql2Database<typeof schema>;
    redis: FastifyRedis;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }

  export interface FastifyRequest {
    apiAccess: ViewApiResponse;
  }
}
