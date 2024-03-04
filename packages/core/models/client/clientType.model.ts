import {
  mysqlTable,
  int,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

export const clientType = mysqlTable("cliente_tipo", {
  id_cliente_tipo: int("id_cliente_tipo").notNull().primaryKey(),
  cliente_tipo: varchar("cliente_tipo", { length: 50 }).notNull(),
  grupo: varchar("grupo", { length: 50 }),
  plataforma: mysqlEnum("plataforma", ["Mania de App"]),
  obs: varchar("obs", { length: 150 }),
  id_cliente_tipo_superior: int("id_cliente_tipo_superior"),
});