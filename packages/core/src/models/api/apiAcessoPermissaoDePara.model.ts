import {
  mysqlTable,
  int,
  timestamp,
} from "drizzle-orm/mysql-core";

export const apiAcessoPermissaoDePara = mysqlTable("api_acesso_permissao_depara", {
  id_api_acesso_permissao: int("id_api_acesso_permissao").notNull().primaryKey(),
  id_api_acesso_permissao_rota: int("id_api_acesso_permissao_rota").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});