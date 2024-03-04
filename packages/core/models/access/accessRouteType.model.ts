import {
  mysqlTable,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const accessRouteType = mysqlTable("acesso_tipo_rota", {
  id_acesso_tipo: int("id_acesso_tipo").notNull().primaryKey(),
  id_rota: int("id_rota").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});