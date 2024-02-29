import { MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "@core/models";

declare module "fastify" {
  export interface FastifyInstance {
    db: MySql2Database<typeof schema>;
  }
}
