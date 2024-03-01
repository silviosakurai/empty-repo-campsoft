import {
  mysqlTable,
  int,
  datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clienteEmailNewsletter = mysqlTable("cliente_email_newsletter", {
  id_cliente: int("id_cliente").notNull().default(sql`uuid_to_bin(uuid())`).primaryKey(),
  id_cliente_email_tipo: int("id_cliente_email_tipo").notNull(),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});