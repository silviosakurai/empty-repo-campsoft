import {
  mysqlTable,
  int,
  datetime,
  varchar,
  mysqlEnum,
  json,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const smsEmailCodes = mysqlTable("sms_email_codes", {
  id_code_enviado: int("id_code_enviado").notNull().primaryKey(),
  id_cliente: varchar("id_cliente", { length: 16 }),
  tipo: mysqlEnum("tipo", ["sms", "email"]),
  destino: varchar("destino", { length: 100 }),
  codigo: varchar("codigo", { length: 10 }).notNull(),
  ip: varchar("ip", { length: 150 }).notNull(),
  envios: int("envios"),
  log: json("log"),
  created_at: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});