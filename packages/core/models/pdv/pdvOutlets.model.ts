import {
  mysqlTable,
  int,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const pdvOutlets = mysqlTable("pdv_pontos_venda", {
  id_pdv_pontos_venda: int("id_pdv_pontos_venda").notNull().primaryKey(),
  nome_local: varchar("nome_local", { length: 50 }),
  cidade: varchar("cidade", { length: 50 }),
  estado: varchar("estado", { length: 2 }),
  logradouro: varchar("logradouro", { length: 100 }),
  telefone: varchar("telefone", { length: 20 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});