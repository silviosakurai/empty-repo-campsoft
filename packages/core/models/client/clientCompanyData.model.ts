import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  binary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const clientCompanyData = mysqlTable("cliente_empresa_dados", {
  id_cliente: binary("id_cliente", { length: 16 }).notNull().primaryKey(),
  id_empresa: int("id_empresa").notNull(),
  status: mysqlEnum("status", ["ativo", "inativo"]).notNull().default("ativo"),
  cpf: varchar("cpf", { length: 11 }),
  telefone: varchar("telefone", { length: 11 }),
  email: varchar("email", { length: 100 }).notNull().default("ativo"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
