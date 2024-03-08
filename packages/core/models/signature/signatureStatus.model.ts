import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";

export const signatureStatus = mysqlTable("assinatura_status", {
  id_assinatura_status: int("id_assinatura_status").notNull().primaryKey(),
  assinatura_status: varchar("assinatura_status", { length: 50 })
    .notNull()
    .default("0"),
  created_at: timestamp("created_at", { mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .notNull()
    .defaultNow(),
});
