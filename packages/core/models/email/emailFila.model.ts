import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  json,
  tinyint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const emailFila = mysqlTable("email_fila", {
  id_email_fila: int("id_email_fila").notNull().primaryKey(),
  id_email_templates: int("id_email_templates"),
  email_validado: tinyint("email_validado").default(0),
  id_email_tipo: int("id_email_tipo"),
  processando: varchar("processando", { length: 8 }),
  id_cliente: varchar("id_cliente", { length: 16 }),
  id_presente: int("id_presente"),
  envio_nome: varchar("envio_nome", { length: 100 }),
  envio_email: varchar("envio_email", { length: 100 }),
  email_dados: json("email_dados"),
  id_email_programados: int("id_email_programados"),
  email_token: varchar("email_token", { length: 60 }),
  data_disparo: datetime("data_disparo").notNull().default(sql`CURRENT_TIMESTAMP`),
  data_disparado: datetime("data_disparado"),
  prioridade: int("prioridade").default(2),
  lida: int("lida", { unsigned: true }).notNull().default(0),
  lida_web: int("lida_web").default(0),
  bounced: mysqlEnum("bounced", ["0", "1", "2"]).default("0"),
  bounce_soft: int("bounce_soft", { unsigned: true }).default(0),
  complaint: mysqlEnum("complaint", ["0", "1"]).default("0"),
  origem: mysqlEnum("origem", ["Site", "App", "Api", "Cron"]),
  erro_status: tinyint("erro_status").default(0),
  erro_envio: varchar("erro_envio", { length: 1000 }),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});