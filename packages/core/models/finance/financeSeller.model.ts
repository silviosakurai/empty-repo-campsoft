import { mysqlTable, json, datetime, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const financeSeller = mysqlTable("financeiro_vendedor", {
  id_financeiro_vendedor: varchar("id_financeiro_vendedor", { length: 36 })
    .notNull()
    .primaryKey(),
  nome: varchar("nome", { length: 50 }),
  business_name: varchar("business_name", { length: 50 }),
  business_phone: varchar("business_phone", { length: 50 }),
  business_email: varchar("business_email", { length: 50 }),
  business_website: varchar("business_website", { length: 100 }),
  business_address: json("business_address"),
  owner: json("owner"),
  created_at: datetime("created_at", { mode: "string" }).default(sql`now()`),
  updated_at: datetime("updated_at", { mode: "string" }).default(sql`now()`),
});
