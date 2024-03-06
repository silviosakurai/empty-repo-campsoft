import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const menuItem = mysqlTable("menu_item", {
  id_menu_item: int("id_menu_item").notNull().primaryKey(),
  id_menu_item_pai: int("id_menu_item_pai"),
  id_empresa: int("id_empresa").default(1),
  status: mysqlEnum("status", ["ativo", "inativo"]),
  ordem: int("ordem").notNull().default(1),
  menu_item: varchar("menu_item", { length: 80 }).notNull(),
  link: varchar("link", { length: 150 }),
  icon: varchar("icon", { length: 150 }),
  id_acesso_tipo: int("id_acesso_tipo"),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
