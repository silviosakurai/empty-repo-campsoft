import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const action = mysqlTable("acao", {
  id_acao: int("id_acao").primaryKey().autoincrement(),
  modulo: varchar("modulo", { length: 100 }).notNull(),
  acao: varchar("acao", { length: 50 }).notNull(),
  descricao: varchar("descricao", { length: 200 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
