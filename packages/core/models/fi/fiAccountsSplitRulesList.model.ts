import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  float,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const fiAccountsSplitRulesList = mysqlTable(
  "fi_contas_split_regra_lista",
  {
    id_fi_contas_split_regra_lista: int("id_fi_contas_split_regra_lista")
      .notNull()
      .primaryKey(),
    id_fi_contas_split_regra: int("id_fi_contas_split_regra").notNull(),
    id_fi_contas: int("id_fi_contas").notNull(),
    status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo"),
    split_conta_id: varchar("split_conta_id", { length: 30 }),
    divisao: mysqlEnum("divisao", ["fixo", "porcentagem"]).default(
      "porcentagem"
    ),
    valor: float("valor"),
    banco_taxas: mysqlEnum("banco_taxas", ["Y", "N"]).default("N"),
    banco_responsavel: mysqlEnum("banco_responsavel", ["Y", "N"]).default("N"),
    banco_sobra: mysqlEnum("banco_sobra", ["Y", "N"]).default("N"),
    transferencia_automatica: mysqlEnum("transferencia_automatica", [
      "Y",
      "N",
    ]).default("Y"),
    transferencia_intervalo: mysqlEnum("transferencia_intervalo", [
      "diario",
      "semanal",
      "mensal",
    ]).default("mensal"),
    transferencia_dia: int("transferencia_dia").default(1),
    antecipacao_ativa: mysqlEnum("antecipacao_ativa", ["Y", "N"]).default("N"),
    antecipacao_tipo: mysqlEnum("antecipacao_tipo", ["full", "1025"]).default(
      "full"
    ),
    antecipacao_porcentagem: float("antecipacao_porcentagem").default(100),
    antecipacao_delay: int("antecipacao_delay"),
    obs: varchar("obs", { length: 200 }),
    created_at: datetime("created_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
    updated_at: datetime("updated_at", { mode: "string" }).default(
      sql`CURRENT_TIMESTAMP`
    ),
  }
);
