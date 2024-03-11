import {
  mysqlTable,
  json,
  datetime,
  varchar,
  smallint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiZoopSeller = mysqlTable("fi_zoop_vendedor", {
  id_fi_zoop_vendedor: varchar("id_fi_zoop_vendedor", { length: 36 })
    .notNull()
    .primaryKey(),
  id_api_acesso: varchar("id_api_acesso", { length: 32 }).notNull(),
  sandbox: smallint("sandbox").notNull().default(0),
  nome: varchar("nome", { length: 50 }),
  business_name: varchar("business_name", { length: 50 }),
  business_phone: varchar("business_phone", { length: 50 }),
  business_email: varchar("business_email", { length: 50 }),
  business_website: varchar("business_website", { length: 100 }),
  business_description: varchar("business_description", { length: 100 }),
  business_opening_date: varchar("business_opening_date", { length: 100 }),
  business_facebook: varchar("business_facebook", { length: 100 }),
  business_twitter: varchar("business_twitter", { length: 100 }),
  ein: varchar("ein", { length: 100 }),
  mcc: varchar("mcc", { length: 100 }),
  business_address: json("business_address"),
  owner: json("owner"),
  created_at: datetime("created_at", { mode: "string" }).default(sql`now()`),
  updated_at: datetime("updated_at", { mode: "string" }).default(sql`now()`),
});
