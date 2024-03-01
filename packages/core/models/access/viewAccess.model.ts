import {
  mysqlTable,
  varbinary,
  int,
  mysqlEnum,
  datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const viewAccess = mysqlTable("acesso_view", {
  id_acesso: varbinary("id_acesso", { length: 36 }),
  id_cliente: varbinary("id_cliente", { length: 36 }),
  id_api_acesso: int("id_api_acesso"),
  id_empresa: int("id_empresa"),
  id_acesso_tipo: int("id_acesso_tipo"),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});