import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const logErros2 = mysqlTable("log_erros2", {
  id_log_erros_uuid: varbinary("id_log_erros_uuid", { length: 16 }).notNull().default(sql`uuid_to_bin(uuid())`).primaryKey(),
  origem: varchar("origem", { length: 50 }).notNull(),
  url_interna: varchar("url_interna", { length: 255 }).notNull(),
  mensagem: varchar("mensagem", { length: 255 }).notNull(),
  method_send: varchar("method_send", { length: 20 }).notNull(),
  status_http: varchar("status_http", { length: 10 }).notNull(),
  parametros: varchar("parametros", { length: 1000 }),
  retorno: varchar("retorno", { length: 1000 }),
  id_cliente: int("id_cliente"),
  email_enviado: mysqlEnum("email_enviado", ["Y", "N"]).notNull().default("N"),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});