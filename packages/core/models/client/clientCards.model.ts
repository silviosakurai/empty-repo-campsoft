import {
  mysqlTable,
  tinyint,
  datetime,
  char,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientCards = mysqlTable("cliente_cartoes", {
  card_id: char("card_id", { length: 40 }),
  fingerprint: char("fingerprint", { length: 30 }),
  valid: tinyint("valid"),
  brand: char("brand", { length: 20 }),
  first_digits: char("first_digits", { length: 10 }),
  last_digits: char("last_digits", { length: 8 }),
  expiration_date: char("expiration_date", { length: 4 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});