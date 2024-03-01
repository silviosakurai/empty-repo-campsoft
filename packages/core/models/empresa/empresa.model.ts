import {
  mysqlTable,
  int,
  timestamp,
  varchar,
  mysqlEnum,
  bigint,
} from "drizzle-orm/mysql-core";

export const empresa = mysqlTable("empresa", {
  id_empresa: int("id_empresa").notNull().primaryKey(),
  id_empresa_pai: int("id_empresa_pai"),
  id_api_acesso: int("id_api_acesso"),
  id_empresa_tipo: int("id_empresa_tipo"),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  nome_fantasia: varchar("nome_fantasia", { length: 50 }),
  razao_social: varchar("razao_social", { length: 50 }),
  nome_responsavel: varchar("nome_responsavel", { length: 50 }),
  sobrenome_responsavel: varchar("sobrenome_responsavel", { length: 50 }),
  email_responsavel: varchar("email_responsavel", { length: 100 }),
  telefone: bigint("telefone", { mode: "number", unsigned: true }),
  cnpj: int("cnpj", { unsigned: true }),
  obs: varchar("obs", { length: 150 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});