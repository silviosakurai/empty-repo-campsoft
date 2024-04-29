import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const group = mysqlTable("grupo", {
  id_grupo: int("id_grupo").primaryKey().autoincrement(),
  id_grupo_pai: int("id_grupo_pai"),
  id_parceiro: int("id_parceiro"),
  grupo: varchar("grupo", { length: 100 }).notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
