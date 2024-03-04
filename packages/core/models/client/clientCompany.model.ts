import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientCompany = mysqlTable("cliente_empresa", {
  id_cliente: int("id_cliente").notNull().primaryKey(),
  id_empresa: int("id_empresa").notNull(),
  id_cliente_tipo: int("id_cliente_tipo"),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  cpf: varchar("cpf", { length: 11 }),
  telefone: varchar("telefone", { length: 11 }),
  email: varchar("email", { length: 100 }).notNull().default("ativo"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});