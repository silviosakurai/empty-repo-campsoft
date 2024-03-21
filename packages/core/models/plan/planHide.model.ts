import { mysqlTable, int, timestamp } from "drizzle-orm/mysql-core";

export const planHide = mysqlTable("plano_ocultar", {
  id_plano: int("id_plano").notNull().primaryKey(),
  id_plano_ocultar: int("id_plano_ocultar").notNull().primaryKey(),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
