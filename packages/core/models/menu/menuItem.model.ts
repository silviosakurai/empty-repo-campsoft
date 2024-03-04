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
  id_menu_grupo: int("id_menu_grupo"),
  ordem: int("ordem").notNull().default(1),
  menu_item: varchar("menu_item", { length: 80 }).notNull(),
  link: varchar("link", { length: 150 }),
  icon: varchar("icon", { length: 150 }),
  id_cliente_acesso_tipo: int("id_cliente_acesso_tipo"),
  id_rotas: int("id_rotas"),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});