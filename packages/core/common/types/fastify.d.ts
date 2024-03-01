import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  export interface FastifyInstance {
    db: MySql2Database<typeof schema>;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
