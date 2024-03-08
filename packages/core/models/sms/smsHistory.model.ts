import {
  mysqlTable,
  int,
  datetime,
  varchar,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const smsHistory = mysqlTable("sms_historico", {
  id_sms_historico: int("id_sms_historico")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_template: int("id_template").notNull(),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  remetente: varchar("remetente", { length: 100 }).notNull(),
  destinatario: varchar("destinatario", { length: 100 }).notNull(),
  sms_token_externo: varchar("sms_token_externo", { length: 60 }),
  data_envio: datetime("data_envio"),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
