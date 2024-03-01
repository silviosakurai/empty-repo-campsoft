import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const emailTipo = mysqlTable("email_tipo", {
  id_email_tipo: int("id_email_tipo").notNull().primaryKey(),
  desativavel: mysqlEnum("desativavel", ["Y", "N"]).notNull().default("Y"),
  tipo: varchar("tipo", { length: 50 }).notNull(),
  obs: varchar("obs", { length: 200 }).notNull(),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});