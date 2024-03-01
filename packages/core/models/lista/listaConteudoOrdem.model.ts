import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const listaConteudoOrdem = mysqlTable("lista_conteudo_ordem", {
  id_lista_conteudo_ordem: int("id_lista_conteudo_ordem").notNull().primaryKey(),
  id_api_acesso: int("id_api_acesso"),
  id_lista: int("id_lista").notNull(),
  ordem: int("ordem").notNull(),
  id_lista_conteudo: int("id_lista_conteudo").notNull(),
  titulo: varchar("titulo", { length: 100 }),
  titulo_dinamico: mysqlEnum("titulo_dinamico", ["Y", "N"]).default("N"),
  var: varchar("var", { length: 75 }),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
});