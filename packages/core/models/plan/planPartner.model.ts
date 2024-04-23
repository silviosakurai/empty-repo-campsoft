import { mysqlTable, int, timestamp } from "drizzle-orm/mysql-core";

export const planPartner = mysqlTable("plano_parceiro", {
  id_plano: int("id_plano").notNull(),
  id_parceiro: int("id_parceiro").notNull(),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
