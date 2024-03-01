import {
  mysqlTable,
  int,
  datetime,
  varchar,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const listaConteudo = mysqlTable("lista_conteudo", {
  id_lista_conteudo: int("id_lista_conteudo").notNull().primaryKey(),
  id_api_acesso: int("id_api_acesso"),
  id_empresa: int("id_empresa"),
  id_lista_conteudo_tipo: int("id_lista_conteudo_tipo").notNull(),
  nome: varchar("nome", { length: 50 }),
  titulo: varchar("titulo", { length: 50 }),
  sql_titulo: varchar("sql_titulo", { length: 5000 }),
  id_banner: int("id_banner", { unsigned: true }),
  sql: varchar("sql", { length: 9000 }),
  var_info_obs: varchar("var_info_obs", { length: 100 }),
  debug: int("debug").default(0),
  obs: varchar("obs", { length: 100 }),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});