import {
  mysqlTable,
  varbinary,
  int,
  mysqlEnum,
  timestamp,
} from "drizzle-orm/mysql-core";

export const apiAccess = mysqlTable("api_acesso", {
  id_api_acesso: int("id_api_acesso").notNull().primaryKey(),
  api_nome: varbinary("api_nome", { length: 50}),
  api_status: mysqlEnum("api_status", ["ativo", "inativo"]),
  api_chave: varbinary("api_chave", { length: 32}),
  api_chave_sandbox: varbinary("api_chave_sandbox", { length: 32}),
  id_fi_zoop_split_regra: int("id_fi_zoop_split_regra"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  id_empresa: int("id_empresa"),
  id_api_acesso_permissao: int("id_api_acesso_permissao"),
});