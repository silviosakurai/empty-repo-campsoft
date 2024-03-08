import { mysqlTable, int, datetime, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const listContentType = mysqlTable("lista_conteudo_tipo", {
  id_lista_conteudo_tipo: int("id_lista_conteudo_tipo").notNull().primaryKey(),
  tipo: varchar("tipo", { length: 50 }),
  obs: varchar("obs", { length: 100 }),
  campos_para_montagem: varchar("campos_para_montagem", { length: 100 }),
  updated_at: datetime("updated_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
  created_at: datetime("created_at", { mode: "string" }).default(
    sql`CURRENT_TIMESTAMP`
  ),
});
