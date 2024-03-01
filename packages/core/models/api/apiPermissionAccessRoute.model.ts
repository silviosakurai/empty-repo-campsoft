import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const apiPermissionAccessRoute = mysqlTable("api_acesso_permissao_rota", {
  id_api_acesso_permissao_rota: int("id_api_acesso_permissao_rota").notNull().primaryKey(),
  api_acesso_permissao_tipo_rota: varchar("api_acesso_permissao_tipo_rota", { length: 50 }),
  metodo: mysqlEnum("metodo", ["GET", "POST", "DELETE", "PATCH", "PUT"]),
  module: varchar("module", { length: 30 }),
  arquivo: varchar("arquivo", { length: 30 }),
  funcao: varchar("funcao", { length: 30 }),
  obs: varchar("obs", { length: 255 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});