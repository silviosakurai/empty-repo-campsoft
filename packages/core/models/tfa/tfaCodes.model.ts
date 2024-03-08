import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  varbinary,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { TFAValidated, TFAType } from "@core/common/enums/models/tfa";

export const tfaCodes = mysqlTable("tfa_codes", {
  id_code_enviado: int("id_code_enviado")
    .notNull()
    .primaryKey()
    .autoincrement(),
  id_cliente: varbinary("id_cliente", { length: 16 }),
  tipo: mysqlEnum("tipo", [TFAType.SMS, TFAType.EMAIL, TFAType.WHATSAPP]),
  destino: varchar("destino", { length: 100 }),
  codigo: varchar("codigo", { length: 10 }).notNull(),
  token: varbinary("token", { length: 16 }).default(sql`uuid_to_bin(uuid())`),
  validado: mysqlEnum("validado", [TFAValidated.YES, TFAValidated.NO]).default(
    TFAValidated.NO
  ),
  created_at: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
