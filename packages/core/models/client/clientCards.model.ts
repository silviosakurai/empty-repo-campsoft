import {
  mysqlTable,
  tinyint,
  datetime,
  char,
  varbinary,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientCards = mysqlTable("cliente_cartoes", {
  card_id: varbinary("card_id", { length: 16 })
    .default("uuid_to_bin(uuid())")
    .notNull()
    .primaryKey(),
  id_cliente: varbinary("id_cliente", { length: 16 }).notNull(),
  id_externo: varchar("id_externo", { length: 50 }).notNull(),
  fingerprint: char("fingerprint", { length: 30 }),
  valid: tinyint("valid"),
  brand: char("brand", { length: 20 }),
  first_digits: char("first_digits", { length: 10 }),
  last_digits: char("last_digits", { length: 8 }),
  expiration_month: char("expiration_month", { length: 2 }),
  expiration_year: char("expiration_year", { length: 2 }),
  default: tinyint("default").notNull(),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
