import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const scheduledEmails = mysqlTable("email_programados", {
  id_email_programados: int("id_email_programados").notNull().primaryKey(),
  id_api_acesso: int("id_api_acesso"),
  id_email_templates: int("id_email_templates"),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("inativo"),
  id_campanha: int("id_campanha"),
  nome: varchar("nome", { length: 100 }),
  data_envio: datetime("data_envio").notNull().default(sql`2030-01-01 00:00:00`),
  disparado: mysqlEnum("disparado", ["Y", "N", "R"]).notNull().default("N"),
  id_cliente_filtro_sql: int("id_cliente_filtro_sql"),
  qtd_disparos_hora: int("qtd_disparos_hora").default(10000),
  repetir_envio_email: mysqlEnum("repetir_envio_email", ["Y", "N"]),
  cooldown_dia_email_historico: int("cooldown_dia_email_historico").default(1),
  email_quantidade_maxima_hoje: int("email_quantidade_maxima_hoje"),
  ciclo_tempo_min: int("ciclo_tempo_min"),
  ciclo_ultima_rodada: datetime("ciclo_ultima_rodada"),
  obs: varchar("obs", { length: 200 }),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});