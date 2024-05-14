import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const financePlans = mysqlTable("financeiro_planos", {
  id_financeiro_planos: varchar("id_financeiro_planos", { length: 32 })
    .notNull()
    .primaryKey(),
  id_plano: int("id_plano"),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  sandbox: int("sandbox"),
  name: varchar("name", { length: 100 }),
  description: varchar("description", { length: 250 }),
  frequency: mysqlEnum("frequency", ["daily", "monthly", "weekly", "annually"]),
  interval: int("interval"),
  amount: int("amount"),
  duration: int("duration"),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
