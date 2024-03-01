import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  text,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const logErros = mysqlTable("log_erros", {
  id_log_erros: varbinary("id_log_erros", { length: 16 }).notNull().default(sql`uuid_to_bin(uuid())`).primaryKey(),
  sandbox: int("sandbox"),
  id_api_acesso: int("id_api_acesso"),
  tipo: mysqlEnum("tipo", ["php", "robo", "api-soft", "api-hard", "db-soft", "db-hard", "outro"]),
  origem: varchar("origem", { length: 20 }),
  status_http: int("status_http"),
  id_empresa: int("id_empresa"),
  error_level: int("error_level").default(1),
  erro_api: varchar("erro_api", { length: 1000 }),
  erro_interno: varchar("erro_interno", { length: 5000 }),
  rest_send: varchar("rest_send", { length: 10000 }),
  method_send: varchar("method_send", { length: 10 }),
  endpoint: varchar("endpoint", { length: 70 }),
  parametros: text("parametros"),
  user_agent: varchar("user_agent", { length: 200 }),
  remote_ip: varchar("remote_ip", { length: 16 }),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});