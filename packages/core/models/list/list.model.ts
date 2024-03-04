import {
  mysqlTable,
  int,
  datetime,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const list = mysqlTable("lista", {
  id_lista: int("id_lista").notNull().primaryKey(),
  id_empresa: int("id_empresa").default(1),
  id_rota: int("id_rota"),
  lista_nome: varchar("lista_nome", { length: 50 }).notNull(),
  var_info_obs: varchar("var_info_obs", { length: 100 }),
  obs: varchar("obs", { length: 50 }).notNull(),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});