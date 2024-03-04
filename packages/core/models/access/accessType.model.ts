import {
  mysqlTable,
  int,
  varchar,
  timestamp,
} from "drizzle-orm/mysql-core";

export const accessType = mysqlTable("acesso_tipo", {
  id_acesso_tipo: int("id_acesso_tipo").primaryKey(),
  acesso_tipo_nome: varchar("acesso_tipo_nome", { length: 100 }).notNull(),
  obs: varchar("obs", { length: 100 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});