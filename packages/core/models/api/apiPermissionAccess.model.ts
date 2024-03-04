import {
  mysqlTable,
  int,
  varbinary,
  timestamp,
} from "drizzle-orm/mysql-core";

export const apiPermissionAccess = mysqlTable("api_acesso_permissao", {
  id_api_acesso_permissao: int("id_api_acesso_permissao").notNull().primaryKey(),
  api_acesso_permissao_nome: varbinary("api_acesso_permissao_nome", { length: 100 }),
  obs: varbinary("obs", { length: 100}),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
