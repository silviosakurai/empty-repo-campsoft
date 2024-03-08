import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const banner = mysqlTable("banner", {
  id_banner: int("id_banner").notNull().primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  local: varchar("local", { length: 20 }),
  id_empresa: int("id_empresa"),
  id_banner_tipo: int("id_banner_tipo"),
  banner: varchar("banner", { length: 50 }),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
