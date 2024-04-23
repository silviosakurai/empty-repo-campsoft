import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const role = mysqlTable("cargo", {
  id_cargo: int("id_cargo").primaryKey().autoincrement(),
  id_parceiro: int("id_parceiro"),
  cargo: varchar("cargo", { length: 100 }).notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
