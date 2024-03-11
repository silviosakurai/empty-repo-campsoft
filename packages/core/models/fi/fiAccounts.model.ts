import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const fiAccounts = mysqlTable("fi_contas", {
  id_fi_contas: int("id_fi_contas").notNull().primaryKey(),
  fi_conta_nome: varchar("fi_conta_nome", { length: 30 }),
  id_empresa: int("id_empresa").default(1),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  tipo: mysqlEnum("tipo", ["pessoa", "empresa"]).default("empresa"),
  cpf_cnpj_conta: varchar("cpf_cnpj_conta", { length: 25 }),
  banco_nome: varchar("banco_nome", { length: 20 }),
  banco_id: varchar("banco_id", { length: 5 }),
  banco_agencia: varchar("banco_agencia", { length: 10 }),
  banco_agencia_dv: varchar("banco_agencia_dv", { length: 2 }),
  banco_conta: varchar("banco_conta", { length: 20 }),
  banco_conta_dv: varchar("banco_conta_dv", { length: 2 }),
  banco_conta_tipo: mysqlEnum("banco_conta_tipo", [
    "conta_corrente",
    "conta_poupanca",
    "conta_corrente_conjunta",
    "conta_poupanca_conjunta",
  ]),
  obs: varchar("obs", { length: 200 }),
  created_at: timestamp("created_at", { mode: "string" }).defaultNow(),
  updated_at: timestamp("updated_at", { mode: "string" }).defaultNow(),
});
