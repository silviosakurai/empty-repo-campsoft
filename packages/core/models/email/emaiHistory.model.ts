import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  tinyint,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { EmailBounced, EmailComplaint } from "@core/common/enums/models/email";

export const emaiHistory = mysqlTable("email_historico", {
  id_email_historico: int("id_email_historico")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_template_email: int("id_template_email").notNull(),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  remetente_nome: varchar("remetente_nome", { length: 100 }).notNull(),
  remetente_email: varchar("remetente_email", { length: 100 }).notNull(),
  destinatario_email: varchar("destinatario_email", { length: 100 }).notNull(),
  email_token_externo: varchar("email_token_externo", { length: 60 }),
  data_envio: datetime("data_envio", { mode: "string" }),
  bounced: mysqlEnum("bounced", [
    EmailBounced.NO_ERROR,
    EmailBounced.TEMPORARY_ERROR,
    EmailBounced.PERMANENT_ERROR,
  ]).default(EmailBounced.NO_ERROR),
  bounce_soft: tinyint("bounce_soft", { unsigned: true }).default(0),
  complaint: mysqlEnum("complaint", [
    EmailComplaint.NO,
    EmailComplaint.YES,
  ]).default(EmailComplaint.NO),
  created_at: datetime("created_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at", { mode: "string" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
