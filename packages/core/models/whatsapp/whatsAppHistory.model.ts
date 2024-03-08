import {
  mysqlTable,
  int,
  datetime,
  varchar,
  varbinary,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import {
  WhatsAppDelivered,
  WhatsAppRead,
} from "@core/common/enums/models/whatsapp";

export const whatsAppHistory = mysqlTable("whatsapp_historico", {
  id_whatsapp_historico: int("id_whatsapp_historico")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_template: int("id_template").notNull(),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  remetente: varchar("remetente", { length: 100 }).notNull(),
  destinatario: varchar("destinatario", { length: 100 }).notNull(),
  whatsapp_token_externo: varchar("whatsapp_token_externo", { length: 60 }),
  data_envio: datetime("data_envio"),
  entregue: mysqlEnum("entregue", [
    WhatsAppDelivered.NO,
    WhatsAppDelivered.YES,
  ]).default(WhatsAppDelivered.NO),
  lido: mysqlEnum("lido", [WhatsAppRead.NO, WhatsAppRead.YES]).default(
    WhatsAppRead.NO
  ),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
