import { TFAType } from "@core/common/enums/TFAType";
import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const smsEmailCodes = mysqlTable("sms_email_codes", {
  id_code_enviado: int("id_code_enviado")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_cliente: varchar("id_cliente", { length: 16 }),
  tipo: mysqlEnum("tipo", [TFAType.SMS, TFAType.EMAIL, TFAType.WHATSAPP]),
  destino: varchar("destino", { length: 100 }),
  codigo: varchar("codigo", { length: 10 }).notNull(),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
