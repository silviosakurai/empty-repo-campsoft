import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { FastifyRedis } from "@fastify/redis";
import { RouteModule } from "@core/common/enums/models/route";
import { ITokenKeyData } from "@core/common/interfaces/ITokenKeyData";
import { ITokenTfaData } from "@core/common/interfaces/ITokenTfaData";
import { ITokenJwtData } from "@core/common/interfaces/ITokenJwtData";

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
    tokenKeyData: ITokenKeyData;
    tokenJwtData: ITokenJwtData;
    tokenTfaData: ITokenTfaData;
    module: RouteModule;
  }
}
