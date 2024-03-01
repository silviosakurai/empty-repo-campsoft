import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  tinyint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const emailFilaHistorico = mysqlTable("email_fila_historico", {
  id_email_fila: int("id_email_fila").notNull().primaryKey(),
  id_email_tipo: int("id_email_tipo").notNull(),
  id_cliente: varchar("id_cliente", { length: 16 }),
  id_presente: int("id_presente"),
  envio_email: varchar("envio_email", { length: 100 }),
  email_dados: varchar("email_dados", { length: 10000 }),
  id_email_programados: int("id_email_programados"),
  id_email_templates: int("id_email_templates"),
  email_token: varchar("email_token", { length: 60 }),
  data_disparo: datetime("data_disparo").notNull(),
  data_disparado: datetime("data_disparado").notNull(),
  lida: tinyint("lida", { unsigned: true }).default(0),
  lida_web: tinyint("lida_web", { unsigned: true }).default(0),
  bounced: mysqlEnum("bounced", ["0", "1", "2"]).default("0"),
  bounce_soft: tinyint("bounce_soft", { unsigned: true }).default(0),
  complaint: tinyint("complaint",  { unsigned: true }).default(0),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});