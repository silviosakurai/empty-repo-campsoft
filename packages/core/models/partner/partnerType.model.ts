import { mysqlTable, int, timestamp, varchar } from "drizzle-orm/mysql-core";

export const partnerType = mysqlTable("parceiro_tipo", {
  id_parceiro_tipo: int("id_parceiro_tipo").notNull().primaryKey(),
  parceiro_tipo: varchar("parceiro_tipo", { length: 50 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
