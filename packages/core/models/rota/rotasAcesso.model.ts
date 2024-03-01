import {
  mysqlTable,
  int,
  datetime,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const rotasAcesso = mysqlTable("rotas_acesso", {
  id_rotas: int("id_rotas").notNull().primaryKey(),
  id_cliente_acesso_tipo: int("id_cliente_acesso_tipo").notNull(),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});