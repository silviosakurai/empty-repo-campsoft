import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiZoopSellerAccount = mysqlTable("fi_zoop_vendedor_conta", {
  id_fi_zoop_vendedor_conta: varchar("id_fi_zoop_vendedor_conta", { length: 32 }).notNull().primaryKey(),
  id_fi_zoop_vendedor: varchar("id_fi_zoop_vendedor", { length: 36 }),
  id_fi_contas: int("id_fi_contas"),
  sandbox: mysqlEnum("sandbox", ["Y", "N"]).notNull().default("Y"),
  holder_name: varchar("holder_name", { length: 50 }),
  bank_code: varchar("bank_code", { length: 50 }),
  routing_number: varchar("routing_number", { length: 50 }),
  account_number: varchar("account_number", { length: 50 }),
  taxpayer_id: varchar("taxpayer_id", { length: 50 }),
  ein: varchar("ein", { length: 50 }),
  type: varchar("type", { length: 50 }),
  created_at: datetime("created_at").default(sql`now()`),
  updated_at: datetime("updated_at").default(sql`now()`),
});