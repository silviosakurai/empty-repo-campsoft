import {
  mysqlTable,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const planoOcultar = mysqlTable("plano_ocultar", {
  id_plano: int("id_plano").notNull().primaryKey(),
  id_plano_ocultar: int("id_plano_ocultar").notNull().primaryKey(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});