import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiZoopSplitRule = mysqlTable("fi_zoop_split_regra", {
  id_fi_zoop_split_regra: int("id_fi_zoop_split_regra").notNull().primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  regra_nome: varchar("regra_nome", { length: 35 }),
  regra_tipo: mysqlEnum("regra_tipo", ["assinatura", "venda"]).default("venda"),
  id_fi_zoop_plano: varchar("id_fi_zoop_plano", { length: 32 }),
  teste_tipo: mysqlEnum("teste_tipo", ["day", "month", "week", "year"]),
  teste_periodo: int("teste_periodo"),
  obs: varchar("obs", { length: 200 }),
  created_at: datetime("created_at", { mode: "string" }).default(sql`now()`),
  updated_at: datetime("updated_at", { mode: "string" }).default(sql`now()`),
});
