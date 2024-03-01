import {
  mysqlTable,
  int,
  varchar,
  timestamp
} from "drizzle-orm/mysql-core";

export const assinaturaStatus = mysqlTable("assinatura_status", {
  id_assinatura_status: int("id_assinatura_status").notNull().primaryKey(),
  assinatura_status: varchar("assinatura_status", { length: 50 }).notNull().default("0"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});