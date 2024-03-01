import {
  mysqlTable,
  int,
  datetime,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clienteAcesso = mysqlTable("cliente_acesso", {
  id_cliente_tipo: int("id_cliente_tipo").notNull().primaryKey(),
  id_empresa: int("id_empresa").notNull(),
  id_cliente_acesso_tipo: int("id_cliente_acesso_tipo").notNull().primaryKey(),
  leitura: mysqlEnum("leitura", ["0", "1"]),
  escrita: mysqlEnum("escrita", ["0", "1"]),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});