import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiAccountsSplitRules = mysqlTable("fi_contas_split_regra", {
  id_fi_contas_split_regra: int("id_fi_contas_split_regra")
    .notNull()
    .primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  regra_nome: varchar("regra_nome", { length: 35 }),
  regra_tipo: mysqlEnum("regra_tipo", ["assinatura", "venda"]).default("venda"),
  obs: varchar("obs", { length: 200 }),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
