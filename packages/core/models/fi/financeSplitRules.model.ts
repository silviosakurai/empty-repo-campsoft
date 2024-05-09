import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { FinanceAccountsSplitRulesStatus } from "@core/common/enums/models/financeAccountsSplitRules";

export const financeSplitRules = mysqlTable("financeiro_split_regras", {
  id_financeiro_split_regras: int("id_financeiro_split_regras")
    .notNull()
    .primaryKey(),
  status: mysqlEnum("status", [
    FinanceAccountsSplitRulesStatus.active,
    FinanceAccountsSplitRulesStatus.inactive,
  ])
    .notNull()
    .default(FinanceAccountsSplitRulesStatus.active),
  regra_nome: varchar("regra_nome", { length: 35 }),
  obs: varchar("obs", { length: 200 }),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
