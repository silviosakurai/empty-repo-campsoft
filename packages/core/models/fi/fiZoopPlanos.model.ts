import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiZoopPlanos = mysqlTable("fi_zoop_planos", {
  id_fi_zoop_planos: varchar("id_fi_zoop_planos", { length: 32 }).notNull().primaryKey(),
  id_plano: int("id_plano"),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  sandbox: int("sandbox"),
  name: varchar("name", { length: 100 }),
  description: varchar("description", { length: 250 }),
  frequency: mysqlEnum("frequency", ["daily", "monthly", "weekly", "annually"]),
  interval: int("interval"),
  amount: int("amount"),
  duration: int("duration"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});