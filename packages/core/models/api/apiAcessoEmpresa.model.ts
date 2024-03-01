import {
  mysqlTable,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const apiAcessoEmpresa = mysqlTable("api_acesso_empresa", {
  id_api_acesso: int("id_api_acesso").notNull().primaryKey(),
  id_empresa: int("id_empresa").notNull(),
  id_api_acesso_permissao: int("id_api_acesso_permissao").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});