import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  float,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiZoopSplitList = mysqlTable("financeiro_split_lista", {
  id_financeiro_split_lista: varchar("id_financeiro_split_lista", {
    length: 36,
  })
    .notNull()
    .primaryKey(),
  id_financeiro_split_regras: int("id_financeiro_split_regras").notNull(),
  sandbox: int("sandbox").default(1),
  id_fi_zoop_vendedor: varchar("id_fi_zoop_vendedor", { length: 36 }),
  id_fi_contas: int("id_fi_contas"),
  id_fi_zoop_vendedor_conta: varchar("id_fi_zoop_vendedor_conta", {
    length: 32,
  }),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo"),
  principal: mysqlEnum("principal", ["Y", "N"]).default("N"),
  liable: mysqlEnum("liable", ["Y", "N"]),
  charge_processing_fee: mysqlEnum("charge_processing_fee", ["Y", "N"]),
  charge_recipient_processing_fee: mysqlEnum(
    "charge_recipient_processing_fee",
    ["Y", "N"]
  ),
  is_gross_amount: mysqlEnum("is_gross_amount", ["Y", "N"]),
  percentage_amount: mysqlEnum("percentage_amount", ["percentage", "amount"]),
  valor: float("valor"),
  antecipacao: mysqlEnum("antecipacao", ["Y", "N"]),
  created_at: datetime("created_at", { mode: "string" }).default(sql`now()`),
  updated_at: datetime("updated_at", { mode: "string" }).default(sql`now()`),
});
