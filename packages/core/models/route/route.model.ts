import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { RouteMethod, RouteModule } from "@core/common/enums/models/route";

export const route = mysqlTable("rota", {
  id_rota: int("id_rota").notNull().primaryKey(),
  rota: varchar("rota", { length: 50 }),
  metodo: mysqlEnum("metodo", [
    RouteMethod.GET,
    RouteMethod.POST,
    RouteMethod.DELETE,
    RouteMethod.PATCH,
    RouteMethod.PUT,
  ]),
  module: mysqlEnum("module", [RouteModule.PARTNER, RouteModule.PUBLIC]),
  obs: varchar("obs", { length: 255 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
