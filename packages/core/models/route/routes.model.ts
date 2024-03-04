import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const routes = mysqlTable("rotas", {
  id_rotas: int("id_rotas").notNull().primaryKey(),
  nome: varchar("nome", { length: 50 }),
  id_rotas_grupo: varchar("id_rotas_grupo", { length: 20 }),
  login: mysqlEnum("login", ["Y", "N"]).default("Y"),
  metodo: varchar("metodo", { length: 50 }),
  classe: varchar("classe", { length: 50 }),
  modulo: varchar("modulo", { length: 50 }),
  apelido: varchar("apelido", { length: 50 }),
  variaveis: varchar("variaveis", { length: 50 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});