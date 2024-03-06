import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const route = mysqlTable("rota", {
  id_rota: int("id_rota").notNull().primaryKey(),
  rota: varchar("rota", { length: 50 }),
  metodo: mysqlEnum("metodo", ["GET", "POST", "DELETE", "PATCH", "PUT"]),
  module: varchar("module", { length: 30 }),
  obs: varchar("obs", { length: 255 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
