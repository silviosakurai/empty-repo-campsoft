import { mysqlTable, datetime, varchar, binary } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientPayment = mysqlTable("cliente_pagamento", {
  id_cliente: binary("id_cliente", { length: 16 }).notNull().primaryKey(),
  id_client_externo: varchar("id_client_externo", { length: 100 })
    .unique()
    .notNull(),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
