import {
  mysqlTable,
  int,
  datetime,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const menu = mysqlTable("menu", {
  id_menu: int("id_menu").notNull().primaryKey(),
  id_empresa: int("id_empresa"),
  id_menu_item: int("id_menu_item"),
  menu: varchar("menu", { length: 50 }),
  obs: varchar("obs", { length: 150 }),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});