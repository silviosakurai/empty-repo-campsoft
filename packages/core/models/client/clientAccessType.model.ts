import {
  mysqlTable,
  int,
  varchar,
} from "drizzle-orm/mysql-core";

export const clientAccessType = mysqlTable("cliente_acesso_tipo", {
  id_cliente_acesso_tipo: int("id_cliente_acesso_tipo").notNull().primaryKey(),
  id_cliente_acesso_tipo_pai: int("id_cliente_acesso_tipo_pai"),
  cliente_acesso_tipo: varchar("cliente_acesso_tipo", { length: 50 }).notNull().default("0"),
  acesso_link: varchar("acesso_link", { length: 255 }).notNull().default("0"),
  OBS: varchar("OBS", { length: 100 }),
});