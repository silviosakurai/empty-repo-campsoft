import {
  varchar,
  binary,
  int,
  mysqlTable,
  bigint,
  mysqlEnum,
  char,
} from "drizzle-orm/mysql-core";

export const client = mysqlTable("cliente", {
  id_cliente: binary("id_cliente", { length: 16 }).primaryKey(),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo").notNull(),
  id_cliente_tipo: int("id_cliente_tipo").default(1).notNull(),
  id_facebook: bigint("id_facebook", { mode: "bigint", unsigned: true }),
  nome: varchar("nome", { length: 50 }),
  cpf: varchar("cpf", { length: 11 }),
  cliente_zoop: char("cliente_zoop", { length: 32 }),
  email: varchar("email", { length: 100 }),
  telefone: varchar("telefone", { length: 11 }).notNull(),
});
