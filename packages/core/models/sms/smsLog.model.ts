import {
  mysqlTable,
  json,
  datetime,
  varchar,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const smsLog = mysqlTable("sms_log", {
  sms_log_id: varchar("sms_log_id", { length: 36 }).notNull(),
  status: mysqlEnum("status", ["enviado", "falha"]),
  telefone: varchar("telefone", { length: 11 }),
  mensagem: varchar("mensagem", { length: 200 }),
  log: json("log"),
  created_at: datetime("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: datetime("updated_at").default(sql`CURRENT_TIMESTAMP`),
});